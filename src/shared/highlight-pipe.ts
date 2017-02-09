import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  /**
   * Transform function
   * @param value string
   * @param query string filter value
   * @return filtered string with markup
   */
  transform(item: any, query: string) {
    if (!item.selectable || !query || query.length < 1) { return item.name; }
    return query ? item.name.replace(new RegExp(this._escapeRegexp(query), 'gi'),
      '<span class="highlight">$&</span>') : item.name;
  }

  /**
   * filter pipe
   * @param queryToEscape
   * @return queryToEscape with replace string
   */
  private _escapeRegexp(queryToEscape: string) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
}