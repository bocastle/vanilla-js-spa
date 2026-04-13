package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"go-gonic-api/scheduler"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	// .env 파일 로드 (로컬 개발용, 파일이 없어도 에러 없이 진행)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// 스케줄러 설정 (한국시간)
	loc, _ := time.LoadLocation("Asia/Seoul")
	c := cron.New(cron.WithLocation(loc))

	// 30분 간격으로 메일 전송 (한국시간)
	_, err := c.AddFunc("*/30 * * * *", scheduler.SendDailyEmail)
	if err != nil {
		log.Printf("[MAIN] ERROR: Failed to add cron job: %v", err)
	} else {
		log.Printf("[MAIN] Email scheduler started (every 30 minutes KST)")
	}

	c.Start()
	defer c.Stop()

	r := gin.Default()

	if err := r.SetTrustedProxies(nil); err != nil {
		log.Fatalf("failed to set trusted proxies: %v", err)
	}

	// dist 폴더가 있으면 프로덕션 빌드, 없으면 개발 모드
	var staticDir string
	var htmlFile string
	if _, err := os.Stat("dist"); err == nil {
		staticDir = "dist"
		htmlFile = "dist/index.html"
	} else {
		staticDir = "public"
		htmlFile = "public/index.html"
	}

	r.LoadHTMLFiles(htmlFile)

	// 정적 파일 서빙 (JS, CSS, 이미지 등)
	r.Static("/css", filepath.Join(staticDir, "css"))
	r.Static("/js", filepath.Join(staticDir, "js"))
	r.Static("/pages", filepath.Join(staticDir, "pages"))

	// 헬스 체크 엔드포인트
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// 메인 화면
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
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
		if err != nil || resp.StatusCode != http.StatusOK {
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

	// 호스트/포트 설정
	host := os.Getenv("HOST")
	if host == "" {
		host = "127.0.0.1"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "2580"
	}

	addr := host + ":" + port

	displayHost := host
	if host == "127.0.0.1" || host == "0.0.0.0" {
		displayHost = "localhost"
	}

	log.Printf("[MAIN] Open in browser: http://%s:%s", displayHost, port)

	if err := r.Run(addr); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
		os.Exit(1)
	}
}
