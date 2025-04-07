package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// 정적 파일 서빙 (JS, CSS, 이미지 등)
	r.Static("/static", "./views")

	// HTML 템플릿 로드
	r.LoadHTMLFiles("views/index.html")

	// 라우터 설정
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	r.Run(":2580") // 포트번호 변경 
}