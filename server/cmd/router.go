package cmd

import (
	"log"

	"github.com/jphacks/os_2404/config"
	"github.com/jphacks/os_2404/infra/database"
	"github.com/jphacks/os_2404/web/router"
)

func Exec() {
	conn, err := database.NewConn()
	if err != nil {
		log.Fatal(err)
	}
	err = config.EnvCheck()
	if err != nil {
		log.Fatal(err)
	}

	r := router.NewRouter()
	r.InitUserRouter(conn)
	r.InitAuthRouter(conn)
	r.Serve()
}
