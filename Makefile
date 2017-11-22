SOURCES := template.js facebook.svg generic_web_site.svg github.svg hackernews.svg keybase.svg reddit.svg twitter.svg
ZIP_CONTENTS := proven.svg index.js LICENSE manifest.json

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
