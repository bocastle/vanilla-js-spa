package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
)

func main() {
	r := gin.Default()
	r.LoadHTMLFiles("views/index.html", "views/posts.html")

	// 정적 파일 서빙 (JS, CSS, 이미지 등)
	r.Static("/static", "./static")
	r.Static("/views/css", "./views/css")

	//메인 화면
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	r.GET("/posts", func(c *gin.Context) {
		c.HTML(http.StatusOK, "posts.html", nil)
	})
	var mdFiles = map[string]string{
		"go-intro":  "https://raw.githubusercontent.com/bocastle/logs/main/Go/goroutine(고루틴).md",
		"goroutine": "https://raw.githubusercontent.com/bocastle/logs/main/README.md",
		"js-async":  "https://raw.githubusercontent.com/adam-p/markdown-here/master/README.md",
	}
	r.GET("/render", func(c *gin.Context) {
		id := c.Query("id")
		fmt.Println("id", id)
		url, exists := mdFiles[id]
		if !exists {
			c.String(http.StatusNotFound, "해당 문서를 찾을 수 없습니다.")
			return
		}

		resp, err := http.Get(url)
		if err != nil || resp.StatusCode != 200 {
			c.String(http.StatusBadRequest, "Failed to fetch markdown")
			return
		}
		defer resp.Body.Close()

		markdownData, err := io.ReadAll(resp.Body)
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to read response")
			return
		}

		html := markdown.ToHTML(markdownData, nil, nil)
		c.Data(http.StatusOK, "text/html; charset=utf-8", html)
	})

	r.Run(":2580") // 포트번호 변경
}
