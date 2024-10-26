package router

import (
	"os"

	"github.com/jphacks/os_2404/infra/database"
	"github.com/jphacks/os_2404/infra/discord"
	"github.com/jphacks/os_2404/infra/persistance"

	"github.com/jphacks/os_2404/usecase"
	"github.com/jphacks/os_2404/web/handler"
	auth_middleware "github.com/jphacks/os_2404/web/middleware"
)

func (r Router) InitUserRouter(conn *database.Conn) {
	repoauth := persistance.NewAuthRepository(conn)
	repodiscord := discord.NewClient(os.Getenv("DISCORD_CALLBACK_API"))
	repouser := persistance.NewUserRepository(conn)

	uc := usecase.NewUserUsecase(repouser)
	ac := usecase.NewAuthUsecase(repoauth, repodiscord, repouser)

	m := auth_middleware.NewAuth(ac)
	h := handler.NewUserHandler(uc)

	g := r.Engine.Group("/user", m.Authenticate())
	g.POST("/", h.CreateUser)
	g.GET("/:id", h.GetUser)
	g.DELETE("/:id", h.DeleteUser)
}
