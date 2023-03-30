
const graphql = require('graphql');

const { 
        GraphQLObjectType, 
        GraphQLString, 
        GraphQLID, 
        GraphQLInt
    } = graphql;

const CatMateriaType = new GraphQLObjectType({
    name: "CaMateriaType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString }
    }
});

const CatGrupoType = new GraphQLObjectType({
    name: "CatGrupoType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString }
    }
});

const CatParcialesType = new GraphQLObjectType({
    name: "CatParcialesType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString }
    }
});

const CatAlumnoType = new GraphQLObjectType({
    name: "CatAlumnoType",
    type: "Query",
    fields: {
        matricula:          { type: GraphQLID },
        nombre:             { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString }
    }
});

const CatDiasType = new GraphQLObjectType({
    name: "CatDiasType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLInt },
        id_parcial_periodo: { type: GraphQLInt },
        dia:                { type: GraphQLInt }
    }
});

const CatAsistenciaType = new GraphQLObjectType({
    name: "CatAsistenciaType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLInt },
        id_parcial_periodo: { type: GraphQLInt },
        dia:                { type: GraphQLInt },
        asistencia:         { type: GraphQLString },
        id_alumno:          { type: GraphQLInt },
    }
});

const CatActividadPonderadorType = new GraphQLObjectType({
    name: "CatActividadPonderadorType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLInt },
        id_grup_prof_mat:   { type: GraphQLInt },
        id_ponderador:      { type: GraphQLInt },
        descripcion:        { type: GraphQLString }
    }
});

const CatActividadAlumnoByPonderadorType = new GraphQLObjectType({
    name: "CatActividadAlumnoByPonderadorType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLInt },
        id_parcial_periodo: { type: GraphQLInt },
        id_ponderador:      { type: GraphQLInt },
        descripcion:        { type: GraphQLString },
        id_alumno:          { type: GraphQLInt },
        calificacion:       { type: GraphQLInt }
    }
});

const CatPonderadorType = new GraphQLObjectType({
    name: "CatPonderadorType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLID },
        descripcion:        { type: GraphQLString },
        fechaalta:          { type: GraphQLString },
        fechamodificacion:  { type: GraphQLString },
        estatus:            { type: GraphQLString }
    }
});


const UsuarioType = new GraphQLObjectType({
    name: "UsuarioType",
    type: "Query",
    fields: {
        id:                 { type: GraphQLInt },
        id_profesor:        { type: GraphQLInt },
        id_perfil:          { type: GraphQLInt },
        perfil:             { type: GraphQLString },
        profesor:           { type: GraphQLString },
        id_puesto:          { type: GraphQLInt },
        puesto:             { type: GraphQLString }
    }
});
	

exports.CatMateriaType              = CatMateriaType;
exports.CatGrupoType                = CatGrupoType;
exports.CatParcialesType            = CatParcialesType;
exports.CatAlumnoType               = CatAlumnoType;
exports.CatDiasType                 = CatDiasType;
exports.CatAsistenciaType           = CatAsistenciaType;
exports.CatActividadPonderadorType  = CatActividadPonderadorType;
exports.CatActividadAlumnoByPonderadorType = CatActividadAlumnoByPonderadorType;
exports.CatPonderadorType           = CatPonderadorType;
exports.UsuarioType                 = UsuarioType;
