#!/bin/bash
# gebruik: lh.sh <label> <pad>
export CHROME_PATH=/opt/pw-browsers/chromium
npx -y lighthouse@12.2.1 "http://localhost:4447$2" --quiet --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile --output=json --output-path=".seo/out/lh-$1.json" >/dev/null 2>&1
python3 -c "import json,sys;d=json.load(open('.seo/out/lh-$1.json'));print('$1', ' '.join(f\"{k}={round(v['score']*100)}\" for k,v in d['categories'].items()))"
