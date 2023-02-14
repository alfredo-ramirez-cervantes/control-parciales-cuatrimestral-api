
const { db } = require("../../pgAdaptor");

const { GraphQLObjectType, 
        GraphQLID, 
        GraphQLList, 
        GraphQLString, 
        GraphQLNonNull, 
        GraphQLInt, 
        GraphQLBoolean} = require("graphql");

const { 
        CatMateriaType,
        CatGrupoType,
        CatParcialesType,
        CatAlumnoType,
        CatDiasType,
        CatAsistenciaType,
        CatActividadPonderadorType,
        CatActividadAlumnoByPonderadorType,
        CatPonderadorType 
    } = require("../../schemas/types/cat_type");

const { 
        AlumnoType,
        ActividadesType,
        AsistenciaType 
    } = require("../../schemas/types/core_type");

const query = new GraphQLObjectType({
    name: "Query",
    type: "Query",
    fields: {

        CatListaMateriasByIdProfesor: {
            type: new GraphQLList(new GraphQLNonNull(CatMateriaType)),
            args: { 
                id_profesor: { type: GraphQLInt },            
            },
            resolve(parentValue, args) {
                const querys = `SELECT 	cm.*
                                FROM	"CAT_MATERIA" cm 
                                WHERE 	ID IN(  
                                            SELECT 	cgpm.id_materia  
                                            FROM	"CORE_GRUPO_PROFESOR_MATERIA" cgpm
                                            WHERE 	cgpm.id_profesor = $1
                                        )
                                ORDER BY    cm.DESCRIPCION ASC`;
                const values = [args.id_profesor];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        CatListaGruposByMateria: {
            type: new GraphQLList(new GraphQLNonNull(CatGrupoType)),
            args: {                 
                id_profesor: { type: GraphQLInt },    
                id_materia: { type: GraphQLInt },            
            },
            resolve(parentValue, args) {
                const querys = `SELECT 	cg.*
                                FROM	"CAT_GRUPO" cg 
                                WHERE 	ID IN(  
                                            SELECT 	cgpm.id_grupo  
                                            FROM	"CORE_GRUPO_PROFESOR_MATERIA" cgpm
                                            WHERE 	cgpm.id_profesor = $1 
                                            AND     cgpm.id_materia = $2 
                                        )
                                ORDER BY    cg.DESCRIPCION ASC`;
                const values = [
                                    args.id_profesor,
                                    args.id_materia
                                ];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        CatListaParciales: {
            type: new GraphQLList(new GraphQLNonNull(CatParcialesType)),
            args: {  },
            resolve(parentValue, args) {
                const querys = `SELECT 	cp.*
                                FROM	"CAT_PARCIAL" cp
                                ORDER BY    cp.DESCRIPCION ASC`;
                const values = [];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        CatListaAlumnosByGrupo: {
            type: new GraphQLList(new GraphQLNonNull(CatAlumnoType)),
            args: {      
                id_grupo:       { type: GraphQLInt },           
            },
            resolve(parentValue, args) {
                const querys = `SELECT 	ca.*
                                FROM	"CAT_ALUMNO" ca
                                WHERE   matricula IN (
                                    SELECT  cga.id_alumno 
                                    FROM    "CORE_GRUPO_ALUMNO" cga 
                                    WHERE   cga.id_grupo = $1 
                                )
                                ORDER BY    ca.NOMBRE ASC`;
                const values = [ 
                                    args.id_grupo, 
                                ];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        //QUITAR
        CatListaDiasByParcial: {
            type: new GraphQLList(new GraphQLNonNull(CatDiasType)),
            args: {      
                id_parcial: { type: GraphQLInt },    
                id_periodo: { type: GraphQLInt },            
            },
            resolve(parentValue, args) {
                const querys = `SELECT 	cdp.id, cdp.id_parcial_periodo , cdp.dia 
                                FROM	"CAT_DIAS_PERIODO" cdp  
                                WHERE 	cdp.id_parcial_periodo  IN(  		
                                        SELECT 	cpp.id  
                                        FROM	"CAT_PARCIAL_PERIODO" cpp 
                                        where	cpp.id_parcial = $1 
                                        and		cpp.id_periodo = $2
                                ) `;
                const values = [ 
                                    args.id_parcial, 
                                    args.id_periodo, 
                                ];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        CatListaAsistenciaByGrupoProfMat: {
            type: new GraphQLList(new GraphQLNonNull(CatAsistenciaType)),
            args: {      
                id_parcial:     { type: GraphQLInt },    
                id_periodo:     { type: GraphQLInt },    
                id_profesor:    { type: GraphQLInt },    
                id_materia:     { type: GraphQLInt },  
                id_grupo:       { type: GraphQLInt },   
                id_alumno:      { type: GraphQLInt },          
            },
            resolve(parentValue, args) {
                const querys = `                                
                                select cdp2.id,cdp2.id_parcial_periodo, cdp2.dia, xx.asistencia, xx.id_alumno 
                                from (
                                    SELECT 	cdp.id, cdp.id_parcial_periodo , cdp.dia 
                                    FROM	"CAT_DIAS_PERIODO" cdp  
                                    WHERE 	cdp.id_parcial_periodo  IN(  		
                                            SELECT 	cpp.id  
                                            FROM	"CAT_PARCIAL_PERIODO" cpp 
                                            where	cpp.id_parcial = $1  
                                            and		cpp.id_periodo = $2 
                                    ) 
                                ) as cdp2 
                                left join (
                                            select  ca.id_dia, ca.asistencia, ca.id_alumno 
                                            from 	"CORE_ASISTENCIA" ca 
                                            WHERE 	ca.id_grupo_prof_mat IN(  
                                                        SELECT 	cgpm.id
                                                        FROM	"CORE_GRUPO_PROFESOR_MATERIA" cgpm
                                                        WHERE 	cgpm.id_profesor = $3  
                                                        AND     cgpm.id_materia = $4 
                                                        AND     cgpm.id_grupo = $5 
                                                    )
                                            and 	ca.id_alumno = $6 
                                            ) as xx
                                on cdp2.id = xx.id_dia
                                `;
                const values = [ 
                                    args.id_parcial, 
                                    args.id_periodo, 
                                    args.id_profesor, 
                                    args.id_materia,
                                    args.id_grupo, 
                                    args.id_alumno  
                                ];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        //QUITAR
        CatListaActividadesByPonderador: {
            type: new GraphQLList(new GraphQLNonNull(CatActividadPonderadorType)),
            args: {      
                id_profesor:    { type: GraphQLInt },    
                id_materia:     { type: GraphQLInt },  
                id_grupo:       { type: GraphQLInt },     
                id_ponderador:  { type: GraphQLInt },     
                id_parcial:     { type: GraphQLInt },     
                id_periodo:     { type: GraphQLInt },            
            },
            resolve(parentValue, args) {
                const querys = `SELECT 	ca.id, ca.id_grup_prof_mat, ca.id_ponderador, ca.descripcion  
                                FROM	"CORE_ACTIVIDAD" ca   
                                WHERE 	ca.id_grup_prof_mat IN(  		
                                    SELECT 	cgpm.id
                                    FROM	"CORE_GRUPO_PROFESOR_MATERIA" cgpm
                                    WHERE 	cgpm.id_profesor = $1   
                                    AND     cgpm.id_materia = $2 
                                    AND     cgpm.id_grupo = $3  
                                ) 
                                and 	ca.id_ponderador = $4 
                                and 	ca.id_parcial_periodo IN(  		
                                    SELECT 	cpp.id  
                                    FROM	"CAT_PARCIAL_PERIODO" cpp 
                                    where	cpp.id_parcial = $5 
                                    and		cpp.id_periodo = $6
                            ) 
                            `;
                const values = [ 
                                    args.id_profesor,   
                                    args.id_materia,    
                                    args.id_grupo,      
                                    args.id_ponderador,
                                    args.id_parcial,
                                    args.id_periodo
                                ];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        CatListaActividadesAlumnosByPonderador: {
            type: new GraphQLList(new GraphQLNonNull(CatActividadAlumnoByPonderadorType)),
            args: {      
                id_parcial:     { type: GraphQLInt },    
                id_periodo:     { type: GraphQLInt },     
                id_ponderador:  { type: GraphQLInt },     
                id_alumno:      { type: GraphQLInt },      
                
                id_profesor:    { type: GraphQLInt },    
                id_materia:     { type: GraphQLInt },  
                id_grupo:       { type: GraphQLInt },         
            },
            resolve(parentValue, args) {
                const querys = `select ca2.id, ca2.id_parcial_periodo, 
                                        ca2.id_ponderador,  ca2.descripcion,
                                        xx.id_alumno, xx.calificacion 
                                from (
                                    SELECT 	ca.id, ca.id_parcial_periodo, ca.id_ponderador, ca.descripcion  
                                    FROM	"CORE_ACTIVIDAD" ca   
                                    WHERE 	ca.id_parcial_periodo IN(  		
                                            SELECT 	cpp.id  
                                            FROM	"CAT_PARCIAL_PERIODO" cpp 
                                            where	cpp.id_parcial = $1 
                                            and		cpp.id_periodo = $2
                                    ) 
                                    and 	ca.id_ponderador = $3 
                                    and 	ca.id_grup_prof_mat IN(  		
                                        SELECT 	cgpm.id
                                        FROM	"CORE_GRUPO_PROFESOR_MATERIA" cgpm
                                        WHERE 	cgpm.id_profesor = $5   
                                        AND     cgpm.id_materia = $6 
                                        AND     cgpm.id_grupo = $7  
                                    ) 
                                ) as ca2 
                                left join (
                                            SELECT 	caa.*
                                            FROM	"CORE_ACTIVIDAD_ALUMNO" caa    
                                            WHERE 	caa.id_actividad IN(  	
                                                            SELECT 	ca3.id
                                                            FROM	"CORE_ACTIVIDAD" ca3   
                                                            WHERE 	ca3.id_parcial_periodo IN(  		
                                                                    SELECT 	cpp.id  
                                                                    FROM	"CAT_PARCIAL_PERIODO" cpp 
                                                                    where	cpp.id_parcial = $1 
                                                                    and		cpp.id_periodo = $2
                                                            ) 	
                                                            and 	ca3.id_ponderador = $3 
                                                    ) 
                                            and caa.id_alumno = $4 
                                        ) as xx
                                on ca2.id = xx.id_actividad`;
                const values = [ 
                                    args.id_parcial, 
                                    args.id_periodo, 
                                    args.id_ponderador,
                                    args.id_alumno,
                                    args.id_profesor,
                                    args.id_materia, 
                                    args.id_grupo,   
                                ];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        CatListaPonderador: {
            type: new GraphQLList(new GraphQLNonNull(CatPonderadorType)),
            args: {  },
            resolve(parentValue, args) {
                const querys = `SELECT 	cp.*
                                FROM	"CAT_PONDERADOR" cp
                                ORDER BY    cp.DESCRIPCION ASC`;
                const values = [];

                return db
                .manyOrNone(querys, values)
                .then(res => res)
                .catch(err => err);
            }
        },

        












































        // CatGenericoById: {
        //     type: CatGenericoType,
        //     args: { id: { type: GraphQLID } },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT      * 
        //                         FROM        cat_generico 
        //                         WHERE       id = $1 
        //                         AND          estatus = 'A'`;
        //         const values = [args.id];

        //         return db
        //         .one(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },

        // CatGenericoListByCat: {
        //     type: new GraphQLList(new GraphQLNonNull(CatGenericoType)),
        //     args: { 
        //         catalogo: { type: GraphQLString },            
        //     },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT      * 
        //                         FROM        cat_generico   
        //                         WHERE       catalogo = $1  
        //                         AND         estatus = 'A' 
        //                         ORDER BY    orden ASC`;
        //         const values = [args.catalogo];

        //         return db
        //         .manyOrNone(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },

        // CatListaMateriasByIdProfesor1: {
        //     type: new GraphQLList(new GraphQLNonNull(CatGenericoType)),
        //     args: { 
        //         id_profesor: { type: GraphQLInt },            
        //     },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT 	*
        //                         FROM	cat_generico cg
        //                         WHERE 	catalogo = 'CAT_MATERIA' 
        //                         AND		id IN (
        //                             SELECT 	cmg.id_materia  
        //                             FROM	core_materia_grupo cmg
        //                             WHERE 	id_profesor = $1
        //                         )
        //                         ORDER BY    orden ASC`;
        //         const values = [args.id_profesor];

        //         return db
        //         .manyOrNone(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },

        // CatListaGruposByIdMateria: {
        //     type: new GraphQLList(new GraphQLNonNull(CatGenericoType)),
        //     args: { 
        //         id_materia: { type: GraphQLInt },            
        //     },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT 	*
        //                         FROM	cat_generico cg
        //                         WHERE 	catalogo = 'CAT_GRUPO' 
        //                         AND		id IN (
        //                             SELECT 	cmg.id_grupo  
        //                             FROM	core_materia_grupo cmg
        //                             WHERE 	id_materia = $1
        //                         )
        //                         ORDER BY    orden ASC`;
        //         const values = [args.id_materia];

        //         return db
        //         .manyOrNone(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },

        // CoreAlumnoByIdGrupo: {
        //     type: new GraphQLList(new GraphQLNonNull(AlumnoType)),
        //     args: { id_grupo: { type: GraphQLInt } },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT  *                                   
        //                         FROM    core_alumno ca 
        //                         WHERE   matricula in (
        //                             SELECT  cga.matricula
        //                             FROM    core_grupo_alumno cga 
        //                             WHERE   cga.id_grupo = $1
        //                         ) 
        //                         ORDER BY    nombre ASC`;
        //         const values = [args.id_grupo];

        //         return db
        //         .manyOrNone(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },

        // CoreActividadesByAlumno: {
        //     type: new GraphQLList(new GraphQLNonNull(ActividadesType)),
        //     args: { 
        //             matricula:      { type: GraphQLInt },
        //             id_parcial:     { type: GraphQLInt },
        //             id_materia:     { type: GraphQLInt },
        //             id_grupo:       { type: GraphQLInt },
        //             id_ponderador:  { type: GraphQLInt } 
        //         },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT a.*
        //                         FROM (
        //                             SELECT 		ca2.id AS id, ca2. descripcion as descripcion, caa.calificacion as calificacion
        //                             FROM 		core_ponderadores ca2 
        //                             LEFT JOIN   core_actividad_alumno caa 
        //                             ON			ca2.id = caa.id_actividad 	
        //                             AND 		caa.matricula = $1  
        //                             AND         ca2.id_parcial = $2
        //                         ) a
        //                         WHERE 	a.id  in (		
        //                                     SELECT 		ca.id
        //                                     FROM  		core_ponderadores ca 
        //                                     WHERE		ca.id_materia_grupo in (                                        
        //                                         SELECT 	cmg.id
        //                                         FROM 	core_materia_grupo cmg  
        //                                         WHERE 	cmg.id_materia	= $3
        //                                         AND 	cmg.id_grupo 	= $4 
        //                                         AND 	cmg.estatus 	= 'A'
        //                                     ) 
        //                                     and id_ponderador = $5 
        //                                     AND ca.id_parcial = $2
        //                         ) 	
        //                     `;
        //         const values = [
        //             args.matricula,   
        //             args.id_parcial, 
        //             args.id_materia,   
        //             args.id_grupo,   
        //             args.id_ponderador
        //         ];

        //         return db
        //         .manyOrNone(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },

        // CoreAsistenciaByAlumno: {
        //     type: new GraphQLList(new GraphQLNonNull(AsistenciaType)),
        //     args: { 
        //             matricula:          { type: GraphQLInt },
        //             id_parcial:         { type: GraphQLInt },
        //             id_materia_grupo:   { type: GraphQLInt }
        //         },
        //     resolve(parentValue, args) {
        //         const querys = `SELECT a.*
        //                         FROM (
        //                             SELECT 	    ca.id, 
        //                                         ca.id_materia_grupo, 
        //                                         ca.id_parcial, 
        //                                         to_char(ca.dia,'YYYY-MM-DD') as dia,
        //                                         caa.asistio 
        //                             FROM		core_asistencia ca     
        //                             LEFT JOIN   core_asistencia_alumno caa 
        //                             ON          ca.id = caa.id_asistencia 
        //                             AND         caa.matricula	= $1
        //                         ) a 
        //                         WHERE 	a.id_parcial        = $2
        //                         AND 	a.id_materia_grupo  = $3
        //                     `;
        //         const values = [
        //             args.matricula,
        //             args.id_parcial,     
        //             args.id_materia_grupo
        //         ];

        //         return db
        //         .manyOrNone(querys, values)
        //         .then(res => res)
        //         .catch(err => err);
        //     }
        // },
               
    }
});

exports.query = query;
