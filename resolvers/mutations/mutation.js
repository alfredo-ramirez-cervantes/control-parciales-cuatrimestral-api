
const graphql = require("graphql");

const { 
        GraphQLObjectType 
    } = graphql;

const db = require("../../pgAdaptor").db;

const {
    ActividadType, 
    ActividadInput,
    ActividadAlumnoType, 
    ActividadAlumnoInput,
    AsistenciaType,
    AsistenciaInput
    } = require("../../schemas/types/core_type");


const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    type: 'Mutation',

    fields: () => ({

        crearActualizarActividad: {
            type: ActividadType,
            args: {
                input: {
                    type: ActividadInput,
                },
            },
            async resolve(parent, args, context, resolveInfo) {

                var query  = null;
                var values = null;

                if(args.input.id){

                    query = 
                    `
                        UPDATE  "CORE_ACTIVIDAD"
                        SET     descripcion  = $2      
                        WHERE   id      = $1
                        RETURNING id
                    `;

                    values =
                    [
                        args.input.id,                             
                        args.input.descripcion 
                    ];

                }else{

                    query = 
                    `   
                        INSERT INTO "CORE_ACTIVIDAD" 
                        ( 
                            id_grup_prof_mat             
                            ,id_ponderador       
                            ,descripcion             
                            ,fechaalta              
                            ,fechamodificacion    
                            ,id_parcial_periodo 
                        )
                        VALUES( (
                                SELECT  id 
                                FROM    "CORE_GRUPO_PROFESOR_MATERIA"   
                                WHERE   id_materia  = $1 
                                AND     id_grupo    = $2
                                AND     id_profesor = $3
                                ), $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (
                                SELECT  id 
                                FROM    "CAT_PARCIAL_PERIODO"     
                                WHERE   id_parcial  = $6 
                                AND     id_periodo  = $7
                                ))
                        RETURNING id;
                    `;

                    values =
                    [
                        args.input.id_materia,   
                        args.input.id_grupo,    
                        args.input.id_profesor, 

                        args.input.id_ponderador, 
                        args.input.descripcion,       

                        args.input.id_parcial,                           
                        args.input.id_periodo   
                    ];
                }

                let update = await db
                    .oneOrNone(query, values)
                    .then(res => res)
                    .catch(err => err);

                return update;
            }
        },

        crearActualizarActividadAlumno: {
            type: ActividadAlumnoType,
            args: {
                input: {
                    type: ActividadAlumnoInput,
                },
            },
            async resolve(parent, args, context, resolveInfo) {

                var query  = null;
                var values = null;

                if(args.input.id){

                    query = 
                    `
                        UPDATE  "CORE_ACTIVIDAD_ALUMNO" 
                        SET     CALIFICACION          = $2      
                        WHERE   id      = $1
                        RETURNING id
                    `;

                    values =
                    [
                        args.input.id,                             
                        args.input.calificacion 
                    ];

                }else{

                    query = 
                    `   
                        INSERT INTO "CORE_ACTIVIDAD_ALUMNO" 
                        ( 
                            id_alumno,          
                            id_actividad,      
                            calificacion
                            ,fechaalta              
                            ,fechamodificacion    
                            ,estatus 
                        )
                        VALUES( $1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'A')
                        RETURNING id;
                    `;

                    values =
                    [
                        args.input.id_alumno,   
                        args.input.id_actividad,    
                        args.input.calificacion, 
                    ];
                }

                let update = await db
                    .oneOrNone(query, values)
                    .then(res => res)
                    .catch(err => err);

                return update;
            }
        },

        
        crearActualizarAsistencia: {
            type: AsistenciaType,
            args: {
                input: {
                    type: AsistenciaInput,
                },
            },
            async resolve(parent, args, context, resolveInfo) {

                var query  = null;
                var values = null;

                if(args.input.id){

                    query = 
                    `
                        UPDATE  "CORE_ASISTENCIA"
                        SET     asistencia  = $2      
                        WHERE   id      = $1
                        RETURNING id
                    `;

                    values =
                    [
                        args.input.id,                             
                        args.input.asistencia 
                    ];

                }else{

                    query = 
                    `   
                        INSERT INTO "CORE_ASISTENCIA" 
                        ( 
                            id_grupo_prof_mat             
                            ,id_dia
                            ,id_alumno       
                            ,asistencia             
                            ,fechaalta              
                            ,fechamodificacion    
                            ,estatus 
                        )
                        VALUES( (
                                    SELECT  id 
                                    FROM    "CORE_GRUPO_PROFESOR_MATERIA"   
                                    WHERE   id_materia  = $1 
                                    AND     id_grupo    = $2
                                    AND     id_profesor = $3
                                ), $4, $5, $6, 
                                 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'A')
                        RETURNING id;
                    `;

                    values =
                    [
                        args.input.id_materia,   
                        args.input.id_grupo,    
                        args.input.id_profesor, 

                        args.input.id_dia, 
                        args.input.id_alumno, 
                        args.input.asistencia  
                    ];
                }

                let update = await db
                    .oneOrNone(query, values)
                    .then(res => res)
                    .catch(err => err);

                return update;
            }
        },
        
    })
});

exports.mutation = Mutations;
