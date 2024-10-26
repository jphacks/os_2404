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

func (r Router) InitAuthRouter(conn *database.Conn) {
	repoauth := persistance.NewAuthRepository(conn)
	repouser := persistance.NewUserRepository(conn)
	repodiscord := discord.NewClient(os.Getenv("DISCORD_CALLBACK_API"))

	ac := usecase.NewAuthUsecase(repoauth, repodiscord, repouser)
	uc := usecase.NewUserUsecase(repouser)
	h := handler.NewAuthHandler(ac, uc)
	m := auth_middleware.NewAuth(ac)

	g := r.Engine.Group("/auth")
	g.GET("/login", h.Login)
	g.GET("/callback", h.Callback)
	g.GET("/validate", m.Authenticate(), h.Validate)
	g.GET("/logout", m.Authenticate(), h.Logout)
	g.GET("/user", m.Authenticate(), h.User)
}
