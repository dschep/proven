from string import Template

class DoublePercentTemplate(Template):
    delimiter = '%%'

template = DoublePercentTemplate(open('template.js').read())

images = {name: open(f'icons/{name}.svg').read() for name in ['facebook',
                                                        'generic_web_site',
                                                        'github', 'hackernews',
                                                        'keybase', 'reddit',
                                                        'twitter','mastodon']}
print(template.substitute(images))
