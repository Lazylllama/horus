#!/usr/bin/env python3
"""Triggers the instance-stats cron endpoint (app/api/cron/route.ts).

Required env:
    CRON_SECRET  must match the CRON_SECRET the app was deployed with

Usage in a hosting platform cron job:
    CRON_SECRET=xxx python3 scripts/run-cron.py

Uses only the standard library, so it runs as-is on python:3.12-slim with no
packages to install. Exits non-zero on any non-2xx response so the platform
marks the run failed.
"""

import os
import sys
import time
import urllib.error
import urllib.request

ENDPOINT = "https://horus.hackclub.com/api/cron"
TIMEOUT_SECONDS = 300
ATTEMPTS = 4
RETRY_DELAY_SECONDS = 5


def log(message: str) -> None:
    # flush so the platform's log collector sees lines as they happen
    print(f"[cron] {message}", flush=True)


def post(secret: str) -> tuple[int, str]:
    request = urllib.request.Request(
        ENDPOINT,
        method="POST",
        headers={"cron-secret": secret},
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            return response.status, response.read().decode(errors="replace")
    except urllib.error.HTTPError as error:
        # 4xx/5xx still carry a body worth logging
        return error.code, error.read().decode(errors="replace")


def main() -> int:
    secret = os.environ.get("CRON_SECRET")
    if not secret:
        log("CRON_SECRET is not set")
        return 1

    for attempt in range(1, ATTEMPTS + 1):
        try:
            status, body = post(secret)
        except (urllib.error.URLError, TimeoutError) as error:
            # connection refused, dns failure, timeout: worth another try
            status, body = None, str(error)
        else:
            # only server errors are worth retrying, a 401 will stay a 401
            if status < 500:
                log(f"POST {ENDPOINT} -> {status}")
                log(body.strip())
                return 0 if 200 <= status < 300 else 1

        label = status if status is not None else "no response"
        if attempt < ATTEMPTS:
            log(f"attempt {attempt}/{ATTEMPTS} failed ({label}), retrying in {RETRY_DELAY_SECONDS}s")
            time.sleep(RETRY_DELAY_SECONDS)
        else:
            log(f"POST {ENDPOINT} -> {label}")
            log(body.strip())

    return 1


if __name__ == "__main__":
    sys.exit(main())
