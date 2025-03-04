package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {

	// Gin 엔진을 생성합니다.
	r := gin.Default()

	// "/" 경로로 요청이 들어오면 index.html을 반환
	r.Static("/static","./views/static")
	r.StaticFile("/", "./views/index.html")

	// 서버 실행
	log.Println("서버 실행 중: http://localhost:2580")
	if err := r.Run(":2580"); err != nil {
		log.Fatal("서버 실행 중 에러:", err)
	}
}