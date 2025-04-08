package handlers

import (
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
)

func RenderMarkdown(c *gin.Context) {
	url := c.Query("url")
	if url == "" {
		c.String(http.StatusBadRequest, "URL is required")
		return
	}

	resp, err := http.Get(url)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to fetch markdown file: %s", err.Error())
		return
	}
	defer resp.Body.Close()

	content, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to read markdown: %s", err.Error())
		return
	}

	html := markdown.ToHTML(content, nil, nil)
	c.Data(http.StatusOK, "text/html; charset=utf-8", html)
}