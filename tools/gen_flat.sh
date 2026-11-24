#!/bin/zsh
# Flat (Imprint-style) art: every missing image in art/raw/flat, 4 at a time.
cd "${0:A:h}/.."
mkdir -p art/raw/flat
gen() { n=$1; size=1024x1024; style=tools/prompts/flat/style.txt
  case $n in lens|morning) size=1536x1024; style= ;; esac
  [[ -f art/raw/flat/$n.png ]] && return
  python3 tools/gen_image.py art/raw/flat/$n.png $size tools/prompts/flat/p_$n.txt $style; }
if (( $# )); then names=($@); else names=(creation fall flood promise exodus sinai david psalms daniel jonah birth shepherd cross tomb pentecost newcreation lens morning); fi
i=0
for n in $names; do gen $n & ((i++)); if (( i % 4 == 0 )); then wait; fi; done; wait
echo ALL DONE
