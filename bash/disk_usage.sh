#!/bin/sh
df 2>&1 | grep -v "Permission denied"
du -sh ../*/
