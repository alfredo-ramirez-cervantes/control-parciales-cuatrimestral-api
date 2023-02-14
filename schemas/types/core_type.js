
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
        id_materia_grupo:   { type: GraphQLInt },
        id_parcial:         { type: GraphQLInt },
        dia:                { type: GraphQLString },
        asistio:            { type: GraphQLString }
    }
});

const PonderadorType = new GraphQLObjectType({
    name: "PonderadorType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        id_parcial:         { type: GraphQLInt },
        id_materia_grupo:   { type: GraphQLInt },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString },
        id_ponderador:      { type: GraphQLInt }
    }
});
    
const PonderadorInput = new GraphQLInputObjectType({
    name: 'PonderadorInput',
    description: 'Input para registrar el Ponderador.',
    fields: () => ({
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        id_parcial:         { type: GraphQLInt },
        id_materia_grupo:   { type: GraphQLInt },
        id_materia:         { type: GraphQLInt },
        id_grupo:           { type: GraphQLInt },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString },
        id_ponderador:      { type: GraphQLInt }
    })
});


exports.AlumnoType          = AlumnoType;
exports.AlumnoInput         = AlumnoInput;
exports.ActividadesType     = ActividadesType;
exports.AsistenciaType      = AsistenciaType;
exports.PonderadorType      = PonderadorType;
exports.PonderadorInput     = PonderadorInput;
