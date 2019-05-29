SOURCES := template.js icons/facebook.svg icons/generic_web_site.svg icons/github.svg icons/hackernews.svg icons/keybase.svg icons/reddit.svg icons/twitter.svg icons/mastodon.svg
ZIP_CONTENTS := index.js LICENSE manifest.json icons/proven32.png icons/proven48.png icons/proven96.png icons/proven128.png icons/proven512.png options.js options.html

proven.zip: $(ZIP_CONTENTS)
	zip -r -FS $@ $^

index.js: $(SOURCES)
	python3.6 inline_images.py > $@

.PHONY: clean lint watch
clean:
	rm -f proven.zip index.js
lint:
	eslint template.js
watch:
	while true; do inotifywait -e modify $(SOURCES) $(ZIP_CONTENTS); make; done
