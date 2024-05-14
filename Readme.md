

# Microservicios
    Propios                                 Puerto                      URL
    *   main-app                            Puerto 3000                 publishwhere.com
    *   socialmedia-connection-service      Puerto 3001                 auth.publishwhere.com
    *   cron-service                        Puerto 3002                 cron.publishwhere.com
    *   content-upload-service              Puerto 3003-3004-3005       post.publishwhere.com
            *   Utiliza nginx para redireccionar
    Externos
    *   S3 Bucket                           URL
    *   Mongo Database                      URL
