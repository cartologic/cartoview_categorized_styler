from distutils.core import setup
from setuptools import find_packages
from __init__ import __version__, APP_NAME
try:
    import pypandoc
    long_description = pypandoc.convert('README.md', 'rst')
except(IOError, ImportError):
    long_description = open('README.md').read()
setup(
  name = APP_NAME,
  packages = find_packages(),
  version = __version__,
  description = 'Create categorized thematic styles for WMS layers with cartoview',
  long_description=long_description,
  author = 'Cartologic',
  author_email = 'info@cartologic.com',
  url = 'https://github.com/cartologic/' + APP_NAME,
  include_package_data=True,
  keywords = ['cartoview', 'gis', 'geonode', "django", "web mapping", "applications", "apps", "styler"],
  classifiers = [
    "Development Status :: 3 - Alpha",
    "Framework :: Django :: 1.8",
    "Topic :: Scientific/Engineering :: GIS"
  ],
  license="BSD",
  install_requires= ['cartoview']
)
