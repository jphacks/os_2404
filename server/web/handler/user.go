package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jphacks/os_2404/domain/entity"
	"github.com/jphacks/os_2404/usecase"
)

type UserHandler struct {
	uc usecase.IUserUsecase
}

func NewUserHandler(uc usecase.IUserUsecase) *UserHandler {
	return &UserHandler{
		uc: uc,
	}
}

func (u *UserHandler) CreateUser(ctx *gin.Context) {
	var json userJson
	if err := ctx.BindJSON(&json); err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	user, err := u.uc.CreateUser(ctx, userJsonToEntity(&json))
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	userjson := userEntityToJson(user)
	ctx.JSON(
		http.StatusOK,
		gin.H{"data": userjson},
	)
}

func (u *UserHandler) DeleteUser(ctx *gin.Context) {
	id := ctx.Param("id")

	err := u.uc.DeleteUser(ctx, id)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	ctx.JSON(
		http.StatusOK,
		gin.H{"data": "success"},
	)
}

func (u *UserHandler) GetUser(ctx *gin.Context) {
	id := ctx.Param("id")

	user, err := u.uc.GetUser(ctx, id)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	userjson := userEntityToJson(user)
	ctx.JSON(
		http.StatusOK,
		gin.H{"data": userjson},
	)
}

type userJson struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Img  string `json:"img"`
}

func userEntityToJson(c *entity.User) userJson {
	return userJson{
		Id:   c.Id,
		Name: c.Name,
		Img:  c.Img,
	}
}

func userJsonToEntity(j *userJson) *entity.User {
	return &entity.User{
		Id:   j.Id,
		Name: j.Name,
		Img:  j.Img,
	}
}
