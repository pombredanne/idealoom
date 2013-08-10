""" App URL routing and renderers are configured in this module. """

from ..lib.json import json_renderer_factory


# We can't create cornice services here, but at least we can build URI paths.
# They will be used in the respective view modules to create the cornice
# services. Those paths are generated by some of the functions below, but we
# hardcode them here anyway so that tests don't bomb. Yes, we do need a better
# solution.
cornice_paths = dict(posts='api/posts',
                     post='api/posts/{id}')


def backbone_include(config):
    config.add_route('home', '/')
    config.add_route('toc', '/toc')
    config.add_route('nodetest', '/nodetest')
    config.add_route('styleguide', '/styleguide')
    config.add_route('test', '/test')
    
def includeme(config):
    """ Initialize views and renderers at app start-up time. """

    config.add_renderer('json', json_renderer_factory)
    config.add_route('discussion_list', '/')
    
    config.include(backbone_include, route_prefix='/{discussion_slug}')

    #config.include(api_urls, route_prefix='/api')

    #  authentication
    config.include('.auth')


#def api_urls(config):
#    config.include(api_post_urls, route_prefix='/posts')


def api_post_urls(config):
    global cornice_paths
    cornice_paths['posts'] = config.route_prefix
    cornice_paths['post'] = '%s/{id}' % config.route_prefix
