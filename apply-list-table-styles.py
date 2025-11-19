#!/usr/bin/env python3
"""
記事内のリストとテーブルを、デザインに合わせたスタイルに変換するスクリプト
"""
import re
from pathlib import Path

def convert_markdown_table_to_html(md_table):
    """MarkdownテーブルをHTMLテーブルに変換"""
    lines = [line.strip() for line in md_table.strip().split('\n') if line.strip()]
    if len(lines) < 2:
        return md_table
    
    # ヘッダー行を取得
    header_line = lines[0]
    # セパレーター行をスキップ
    data_lines = lines[2:]
    
    # ヘッダーをパース
    headers = [cell.strip() for cell in header_line.split('|')[1:-1]]
    
    # HTMLテーブルを生成
    html = '<div class="table-box">\n'
    html += '  <div class="table-box__title">比較表</div>\n'
    html += '  <table>\n'
    html += '    <thead>\n'
    html += '      <tr>\n'
    for header in headers:
        html += f'        <th>{header}</th>\n'
    html += '      </tr>\n'
    html += '    </thead>\n'
    html += '    <tbody>\n'
    
    for line in data_lines:
        cells = [cell.strip() for cell in line.split('|')[1:-1]]
        html += '      <tr>\n'
        for i, cell in enumerate(cells):
            # 太字を保持
            cell_html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', cell)
            html += f'        <td>{cell_html}</td>\n'
        html += '      </tr>\n'
    
    html += '    </tbody>\n'
    html += '  </table>\n'
    html += '</div>'
    
    return html

def convert_list_to_listbox(md_list, title=None):
    """Markdownリストをリストボックスに変換"""
    lines = [line.strip() for line in md_list.strip().split('\n') if line.strip()]
    if not lines:
        return md_list
    
    # リストタイプを判定（ul or ol）
    is_ordered = any(re.match(r'^\d+\.\s+', line) for line in lines)
    list_tag = 'ol' if is_ordered else 'ul'
    
    html = '<div class="list-box">\n'
    if title:
        html += f'  <div class="list-box__title">{title}</div>\n'
    html += f'  <{list_tag}>\n'
    
    for line in lines:
        # リストアイテムを抽出
        if is_ordered:
            match = re.match(r'^\d+\.\s+(.*)$', line)
        else:
            match = re.match(r'^[-*]\s+(.*)$', line)
        
        if match:
            content = match.group(1)
            # 太字を保持
            content_html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
            html += f'    <li>{content_html}</li>\n'
    
    html += f'  </{list_tag}>\n'
    html += '</div>'
    
    return html

def process_article(file_path):
    """記事ファイルを処理"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Markdownテーブルを検出して変換
    table_pattern = r'(\|[^\n]+\|\n(?:\|[^\n]+\|\n)*\|[^\n]+\|)'
    tables = re.finditer(table_pattern, content, re.MULTILINE)
    
    for match in reversed(list(tables)):  # 後ろから処理（インデックスがずれないように）
        md_table = match.group(1)
        html_table = convert_markdown_table_to_html(md_table)
        content = content[:match.start()] + html_table + content[match.end():]
    
    # 変更があった場合のみファイルを更新
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if __name__ == '__main__':
    posts_dir = Path('_posts')
    updated_count = 0
    
    for md_file in sorted(posts_dir.glob('*.md')):
        if process_article(md_file):
            updated_count += 1
            print(f"✅ Updated: {md_file.name}")
    
    print(f"\n総更新数: {updated_count}件")

