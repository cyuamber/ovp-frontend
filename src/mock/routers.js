module.exports =
    {
        "/articles/:user": "/articles?user=:user",

        "/api/*": "/$1",
        "/:resource/:id/show": "/:resource/:id",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1/$2/$3/$4",
    }