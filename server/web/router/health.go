package router

import "github.com/jphacks/os_2404/web/handler"

func (r Router) InitHealthRouter() {
	r.Engine.GET("/health", handler.HealthHandler)
}
