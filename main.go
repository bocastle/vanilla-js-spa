package main

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
)

func main() {
	r := gin.Default()
	r.LoadHTMLFiles("views/index.html")
	// 정적 파일 서빙 (JS, CSS, 이미지 등)
	r.Static("/static", "./static")

	//메인 화면
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	r.GET("/render", func(c *gin.Context) {
		url := c.Query("url")
		if url == "" {
			c.String(http.StatusBadRequest, "URL is required")
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
