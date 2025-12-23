package scheduler

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"time"
)

// SendEmail sends an email using SMTP
func SendEmail(to, subject, body string) error {
	// 환경 변수에서 SMTP 설정 가져오기
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPassword := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM")

	// 환경 변수가 없으면 기본값 사용 (Gmail 예시)
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}
	if smtpPort == "" {
		smtpPort = "587"
	}
	if from == "" {
		from = smtpUser
	}

	// 메일 메시지 구성
	msg := []byte(fmt.Sprintf("To: %s\r\n", to) +
		fmt.Sprintf("Subject: %s\r\n", subject) +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n" +
		"\r\n" +
		body + "\r\n")

	// SMTP 인증
	auth := smtp.PlainAuth("", smtpUser, smtpPassword, smtpHost)

	// 메일 전송
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)
	log.Printf("[EMAIL] Attempting to send email to %s via %s", to, addr)
	err := smtp.SendMail(addr, auth, from, []string{to}, msg)
	if err != nil {
		log.Printf("[EMAIL] ERROR: Failed to send email: %v", err)
		return fmt.Errorf("failed to send email: %v", err)
	}
	log.Printf("[EMAIL] Email sent successfully to %s", to)

	return nil
}

// SendDailyEmail sends daily email at 1 PM KST
func SendDailyEmail() {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	log.Printf("[SCHEDULER] Daily email job started at %s", timestamp)

	// 환경 변수에서 수신자 이메일 가져오기
	to := os.Getenv("EMAIL_TO")
	if to == "" {
		log.Printf("[SCHEDULER] ERROR: EMAIL_TO environment variable is not set")
		return
	}

	subject := "일일 리포트"
	body := `
		<html>
		<body>
			<h2>일일 리포트</h2>
			<p>안녕하세요!</p>
			<p>오늘도 좋은 하루 되세요.</p>
		</body>
		</html>
	`

	err := SendEmail(to, subject, body)
	if err != nil {
		log.Printf("[SCHEDULER] ERROR: Failed to send daily email to %s: %v", to, err)
	} else {
		log.Printf("[SCHEDULER] SUCCESS: Daily email sent successfully to %s at %s", to, timestamp)
	}
}
