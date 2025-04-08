package main

import (
	"go-gonic-api/handlers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLFiles("views/index.html")
	// 정적 파일 서빙 (JS, CSS, 이미지 등)
	r.Static("/static","./views/static")

	//메인 화면 
	r.GET("/" , func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	// Markdown 렌더링 API
	r.GET("/render", handlers.RenderMarkdown)  

	r.Run(":2580") // 포트번호 변경 
}