#!/bin/sh
# Voice the locked v2 script, one take per chapter (Ellis, eleven_v4). The heavy chapter (ch08) gets longer paragraph gaps;
# the voice itself is never sped up or slowed down.
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
for f in script/v2/ch*.txt; do
  n=v2_$(basename "$f" .txt)
  [ -f "public/audio/$n.wav" ] && { echo "skip $n"; continue; }
  case "$n" in *ch08*) VOICE_PARA_GAP=1.4 python3 tools/voice.py "$f" "$n" ;; *) python3 tools/voice.py "$f" "$n" ;; esac
done
echo VOICEDONE
