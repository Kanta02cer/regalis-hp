FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p data/llms_history
# デフォルト: 1時間ごとにバッチ実行
CMD ["sh", "-c", "while true; do python main.py; sleep 3600; done"]
