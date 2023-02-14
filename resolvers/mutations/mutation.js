
const graphql = require("graphql");

const { 
        GraphQLObjectType 
    } = graphql;

const db = require("../../pgAdaptor").db;

const {
        PonderadorType, 
        PonderadorInput 
    } = require("../../schemas/types/core_type");


const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    type: 'Mutation',

    fields: () => ({

        crearActualizarPonderador: {
            type: PonderadorType,
            args: {
                input: {
                    type: PonderadorInput,
                },
            },
            async resolve(parent, args, context, resolveInfo) {

                var query  = null;
                var values = null;

                if(args.input.id){

                    query = 
                    `
                        UPDATE  core_ponderadores
                        SET     descripcion          = $2         
                                ,id_parcial          = $3          
                                ,id_materia_grupo    = $4            
                                ,fechamodificacion   = CURRENT_TIMESTAMP   
                                ,estatus             = $5             
                                ,id_ponderador       = $6 
                        WHERE   id      = $1
                        RETURNING id
                    `;

                    values =
                    [
                        args.input.id,                             
                        args.input.descripcion,                          
                        args.input.id_parcial,   
                        args.input.id_materia_grupo,        
                        args.input.estatus,             
                        args.input.id_ponderador 
                    ];

                }else{

                    query = 
                    `   
                        INSERT INTO core_ponderadores
                        ( 
                            descripcion            
                            ,id_parcial            
                            ,id_materia_grupo      
                            ,fechaalta             
                            ,fechamodificacion   
                            ,id_ponderador 
                        )
                        VALUES( $1, $2, (
                                        SELECT id 
                                        FROM core_materia_grupo
                                        WHERE id_materia  = $3 AND id_grupo = $4), 
                            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 
                            $5)
                        RETURNING id;
                    `;

                    values =
                    [
                        args.input.descripcion,                          
                        args.input.id_parcial,   
                        args.input.id_materia,   
                        args.input.id_grupo, 
                        args.input.id_ponderador 
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
