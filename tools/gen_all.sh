#!/bin/zsh
# Generates every poster and illustration that is missing in art/raw (4 at a time).
cd "${0:A:h}/.."
gen() { n=$1; size=1024x1024; style=tools/prompts/style_poster.txt
  case $n in lens|morning) size=1536x1024; style= ;; esac
  [[ -f art/raw/$n.png ]] && return
  python3 tools/gen_image.py art/raw/$n.png $size tools/prompts/p_$n.txt $style; }
names=(creation fall flood promise exodus sinai david psalms daniel jonah birth shepherd cross tomb pentecost newcreation lens morning)
i=0
for n in $names; do gen $n & ((i++)); if (( i % 4 == 0 )); then wait; fi; done; wait
echo ALL DONE
