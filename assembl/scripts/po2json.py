#!python
"""
Create a JED_ localization file from localized strings used by JS.

.. _JED: https://slexaxton.github.io/Jed/
"""

from os.path import dirname, join
import os
import sys
import locale
import subprocess

from babel.messages.pofile import read_po, write_po

extra_files = {
    "assembl/models/preferences.py",
    "assembl/models/notification.py",
    "assembl/nlp/translation_service.py"
}

if sys.platform == 'darwin':
    locale.setlocale(locale.LC_CTYPE, "UTF-8")
else:
    locale.setlocale(locale.LC_CTYPE, "C.UTF-8")


def is_js(msg):
    for (filename, lineno) in msg.locations:
        if filename.endswith('.js'):
            return True
        # Also send notification data
        if filename in extra_files:
            return True

po2json_script = join(dirname(dirname(__file__)),
                      'static','node_modules', '.bin', 'po2json')


def po2json(fname):
    with open(fname) as f:
        po = read_po(f)
    remove_ids = [msg.id for msg in po if not is_js(msg)]
    for id in remove_ids:
        del po[id]
    jspo_filename = fname[:-3]+".js.po"
    jed_filename = fname[:-3]+".jed.json"
    with open(jspo_filename, 'wb') as f:
        write_po(f, po)
    # python is in the same venv dir as node
    node = join(dirname(sys.executable), 'node')
    r = subprocess.call([node, po2json_script, "--format", "jed", jspo_filename, jed_filename])
    os.unlink(jspo_filename)
    return r

if __name__ == '__main__':
    for root, dirnames, filenames in os.walk(
            join(dirname(dirname(__file__)), 'locale')):
        if 'assembl.po' in filenames:
            po2json(join(root, 'assembl.po'))
