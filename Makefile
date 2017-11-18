proven.zip: icon_128.png icon_48.png icon_512.png index.js LICENSE manifest.json
	zip -r -FS $@ $^

index.js: template.js facebook.svg generic_web_site.svg github.svg hackernews.svg keybase.svg reddit.svg
	python3.6 inline_images.py > $@

.PHONY: clean
clean:
	rm -f proven.zip index.js
