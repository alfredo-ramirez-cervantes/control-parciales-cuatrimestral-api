
const graphql = require('graphql');

const { 
        GraphQLObjectType, 
        GraphQLInputObjectType,
        GraphQLString, 
        GraphQLID, 
        GraphQLInt, 
        GraphQLFloat  
    } = graphql;
    
const AlumnoType = new GraphQLObjectType({
    name: "AlumnoType",
    type: "Query",
    fields: {
        matricula:          { type: GraphQLID },
        nombre:             { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString },
        calf_actividad:     { type: GraphQLFloat },
        calf_examen:        { type: GraphQLFloat }, 
        calf_desempenio:    { type: GraphQLFloat } 
    }
});

const AlumnoInput = new GraphQLInputObjectType({
    name: 'AlumnoInput',
    description: 'Input para registrar los Alumnos.',
    fields: () => ({
        matricula:          { type: GraphQLID },
        nombre:             { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString } 
    })
});

const ActividadesType = new GraphQLObjectType({
    name: "ActividadesType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        calificacion:       { type: GraphQLFloat } 
    }
});

const AsistenciaType = new GraphQLObjectType({
    name: "AsistenciaType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
    }
});


const AsistenciaInput = new GraphQLInputObjectType({
    name: 'AsistenciaInput',
    description: 'Input para registrar la AsistenciaInput.',
    fields: () => ({
        
        id:                 { type: GraphQLID },
        id_grupo_prof_mat:      { type: GraphQLInt },
        id_dia:      { type: GraphQLInt },
        id_alumno:      { type: GraphQLInt },
        asistencia:        { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString },
        
        id_materia:         { type: GraphQLInt },
        id_grupo:           { type: GraphQLInt },
        id_profesor:        { type: GraphQLInt },
    })
});


const ActividadType = new GraphQLObjectType({
    name: "ActividadType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        id_ponderador:      { type: GraphQLInt },
        descripcion:        { type: GraphQLString },
        id_parcial:         { type: GraphQLInt },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString },       
    }
});
    
const ActividadInput = new GraphQLInputObjectType({
    name: 'ActividadInput',
    description: 'Input para registrar la Actgividad.',
    fields: () => ({
        
        id:                 { type: GraphQLID },
        id_ponderador:      { type: GraphQLInt },
        descripcion:        { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString },
        
        id_materia:         { type: GraphQLInt },
        id_grupo:           { type: GraphQLInt },
        id_profesor:        { type: GraphQLInt },
        
        id_parcial:         { type: GraphQLInt },
        id_periodo:         { type: GraphQLInt },
    })
});


const ActividadAlumnoType = new GraphQLObjectType({
    name: "ActividadAlumnoType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        
    }
});
    
const ActividadAlumnoInput = new GraphQLInputObjectType({
    name: 'ActividadAlumnoInput',
    description: 'Input para registrar la Actgividad alumno.',
    fields: () => ({        
        id:             { type: GraphQLID },
        id_alumno:      { type: GraphQLInt },
        id_actividad:   { type: GraphQLInt },
        calificacion:   { type: GraphQLInt }   
    })
});


exports.AlumnoType          = AlumnoType;
exports.AlumnoInput         = AlumnoInput;
exports.ActividadesType     = ActividadesType;
exports.AsistenciaType      = AsistenciaType;
exports.AsistenciaInput     =AsistenciaInput;
exports.ActividadType       = ActividadType;
exports.ActividadInput          = ActividadInput;
exports.ActividadAlumnoType     = ActividadAlumnoType;
exports.ActividadAlumnoInput    = ActividadAlumnoInput;
