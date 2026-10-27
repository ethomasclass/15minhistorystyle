#!/bin/sh
# A render queue, so finished chapters render one after another instead of fighting for the CPU.
#   echo 04 >> out/render_queue.txt; tools/render_queue.sh      (starts the runner unless one is already running)
# The runner takes chapters from the top of out/render_queue.txt, renders each with tools/render_ch.sh, logs to
# out/render_queue.log, and exits when the queue is empty.
cd "$(dirname "$0")/.."
Q=out/render_queue.txt
mkdir -p out; touch $Q
[ -f out/render_queue.lock ] && kill -0 "$(cat out/render_queue.lock)" 2>/dev/null && { echo "runner already running"; exit 0; }
echo $$ > out/render_queue.lock
while :; do
  n=$(head -1 $Q)
  [ -z "$n" ] && break
  sed -i '1d' $Q
  # wait for any render started outside the queue
  while pgrep -f "remotion render src/index.ts Ch" >/dev/null; do sleep 15; done
  echo "$(date +%H:%M) start ch$n" >> out/render_queue.log
  tools/render_ch.sh $n >> out/render_queue.log 2>&1 && echo "$(date +%H:%M) done ch$n" >> out/render_queue.log || echo "$(date +%H:%M) FAILED ch$n" >> out/render_queue.log
done
rm -f out/render_queue.lock
