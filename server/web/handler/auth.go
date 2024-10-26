package handler

import (
	"fmt"
	"net/http"
	"os"
	"time"

	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jphacks/os_2404/usecase"
)

const oneWeek = 60 * 60 * 24 * 7

// TODO:logout apiも作る必要あり
type AuthHandler struct {
	authUC usecase.IAuthUsecase
	userUC usecase.IUserUsecase
}

func NewAuthHandler(auc usecase.IAuthUsecase, uuc usecase.IUserUsecase) AuthHandler {
	return AuthHandler{
		authUC: auc,
		userUC: uuc,
	}
}

func (u *AuthHandler) Login(ctx *gin.Context) {
	redirectURL := ctx.Query("redirect_url")
	url, _, err := u.authUC.GetAuthURL(ctx, redirectURL)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	ctx.Redirect(http.StatusFound, url)
}

func (u *AuthHandler) Callback(ctx *gin.Context) {
	if errFormValue := ctx.Query("error"); errFormValue != "" {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": errFormValue},
		)
		return
	}
	state := ctx.Query("state")
	if state == "" {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": fmt.Errorf("state empty")},
		)
		return
	}

	code := ctx.Query("code")
	if code == "" {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": fmt.Errorf("code empty")},
		)
		return
	}
	redirectURL, sessionID, err := u.authUC.Authorization(ctx, state, code)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	if redirectURL == "" {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": fmt.Errorf("redirect url empty")},
		)
		return
	}

	claims := jwt.MapClaims{
		"session": sessionID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // 72時間が有効期限
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	accessToken, _ := token.SignedString([]byte(os.Getenv("rawPrivKey")))
	ctx.SetSameSite(http.SameSiteLaxMode)
	if os.Getenv("ENVIRONMENT") == "dev" {
		ctx.SetCookie("token", accessToken, oneWeek, "", "", true, true)
	} else {
		ctx.SetCookie("token", accessToken, oneWeek, "", "doer-glyph.net", true, true)
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.Redirect(http.StatusFound, redirectURL)
}

func (u *AuthHandler) Validate(ctx *gin.Context) {
	ctx.JSON(
		http.StatusOK,
		gin.H{"validate": "success"},
	)
}

func (u *AuthHandler) Logout(ctx *gin.Context) {
	tokenString := ctx.Request.Header.Get("jwt")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("rawPrivKey")), nil
	})
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	str := ""
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		str, ok = claims["session"].(string)
		if !ok {
			ctx.JSON(
				http.StatusBadRequest,
				gin.H{"error": fmt.Errorf("kata asa-sion")},
			)
			return
		}
	} else {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": fmt.Errorf("token empty")},
		)
		return
	}
	err = u.authUC.DeleteSession(ctx, str)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	ctx.JSON(
		http.StatusOK,
		gin.H{"logout": "success"},
	)
}

func (u *AuthHandler) User(ctx *gin.Context) {
	tokenString := ctx.Request.Header.Get("jwt")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("rawPrivKey")), nil
	})
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	str := ""
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		str, ok = claims["session"].(string)
		if !ok {
			ctx.JSON(
				http.StatusBadRequest,
				gin.H{"error": fmt.Errorf("kata asa-sion")},
			)
			return
		}
	} else {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": fmt.Errorf("token empty")},
		)
		return
	}

	ok, err := u.authUC.CheckSessionExpiry(ctx, str)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	if !ok {
		err := u.authUC.DeleteSession(ctx, str)
		if err != nil {
			ctx.JSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": "session expiry err"},
		)
		return
	}
	userId, err := u.authUC.GetUserIdFromSession(ctx, str)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	user, err := u.userUC.GetUser(ctx, userId)
	if err != nil {
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}
	ctx.JSON(
		http.StatusOK,
		gin.H{"user": user},
	)
}
