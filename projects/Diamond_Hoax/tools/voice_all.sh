#!/bin/sh
# Voice every chapter:   tools/voice_all.sh            (all)
#                        tools/voice_all.sh 04 07      (just these)
# Default (the user's pick, West series): ElevenLabs eleven_v4, the whole chapter in one take, speed 1.0, no splices.
# HEAVY="10 11" tools/voice_all.sh  voices those chapters a little slower (suffering, the ending).
# VOICE_ONE_TAKE=0 tools/voice_all.sh  goes back to the older paragraph-by-paragraph method (eleven_v3 era settings).
# No speed-up anywhere (Reconstruction): the user hears a stretched voice (tempo and pitch), so STRETCH stays 1.0.
cd "$(dirname "$0")/.."
PY=python3; $PY -c "" 2>/dev/null || PY=python   # on Windows python3 can be just the Store stub
for f in script/ch*.txt; do
  num=$(basename "$f" | sed 's/^ch\([0-9]*\).*/\1/')
  [ -n "$*" ] && ! echo " $* " | grep -q " $num " && continue
  n=$(basename "$f" .txt)
  if [ "${VOICE_ONE_TAKE:-1}" = "0" ]; then
    if echo " $HEAVY " | grep -q " $num "; then
      export VOICE_MAX_PAUSE=0.35 VOICE_SENT_GAP=0.05 VOICE_PARA_GAP=0.55 VOICE_STRETCH=1.0
    else
      export VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.0
    fi
  else
    export VOICE_SENT_GAP=0 VOICE_STRETCH=1.0
    if echo " $HEAVY " | grep -q " $num "; then export VOICE_SPEED=0.92; else export VOICE_SPEED=1.0; fi
  fi
  echo "== $n (speed ${VOICE_SPEED:-default}, stretch $VOICE_STRETCH)"
  $PY tools/voice.py "$f" "$n" 2>&1 | tail -1 || exit 1
done
