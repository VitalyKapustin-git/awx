import React from 'react';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  Level,
  LevelItem,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  BarsIcon,
  EqualsIcon,
  SortAlphaDownIcon,
  SortAlphaUpIcon,
  SortNumericDownIcon,
  SortNumericUpIcon,
  TrashAltIcon,
  PlusIcon
} from '@patternfly/react-icons';
import {
  Link
} from 'react-router-dom';

import Tooltip from '../Tooltip';

class DataListToolbar extends React.Component {
  constructor (props) {
    super(props);

    const { sortedColumnKey } = this.props;

    this.state = {
      isSearchDropdownOpen: false,
      isSortDropdownOpen: false,
      searchKey: sortedColumnKey,
      searchValue: '',
    };

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.onSortDropdownToggle = this.onSortDropdownToggle.bind(this);
    this.onSortDropdownSelect = this.onSortDropdownSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchDropdownToggle = this.onSearchDropdownToggle.bind(this);
    this.onSearchDropdownSelect = this.onSearchDropdownSelect.bind(this);
  }

  handleSearchInputChange (searchValue) {
    this.setState({ searchValue });
  }

  onSortDropdownToggle (isSortDropdownOpen) {
    this.setState({ isSortDropdownOpen });
  }

  onSortDropdownSelect ({ target }) {
    const { columns, onSort, sortOrder } = this.props;

    const [{ key }] = columns.filter(({ name }) => name === target.innerText);

    this.setState({ isSortDropdownOpen: false });

    onSort(key, sortOrder);
  }

  onSearchDropdownToggle (isSearchDropdownOpen) {
    this.setState({ isSearchDropdownOpen });
  }

  onSearchDropdownSelect ({ target }) {
    const { columns } = this.props;

    const targetName = target.innerText;
    const [{ key }] = columns.filter(({ name }) => name === targetName);

    this.setState({ isSearchDropdownOpen: false, searchKey: key });
  }

  onSearch () {
    const { searchValue } = this.state;
    const { onSearch } = this.props;

    onSearch(searchValue);
  }

  render () {
    const { up } = DropdownPosition;
    const {
      columns,
      isAllSelected,
      onSelectAll,
      onSort,
      sortedColumnKey,
      sortOrder,
      addUrl,
      showExpandCollapse
    } = this.props;
    const {
      // isActionDropdownOpen,
      isSearchDropdownOpen,
      isSortDropdownOpen,
      searchKey,
      searchValue,
    } = this.state;

    const [searchColumn] = columns
      .filter(({ key }) => key === searchKey);
    const searchColumnName = searchColumn.name;

    const [sortedColumn] = columns
      .filter(({ key }) => key === sortedColumnKey);
    const sortedColumnName = sortedColumn.name;
    const isSortNumeric = sortedColumn.isNumeric;
    const displayedSortIcon = () => {
      let icon;
      if (sortOrder === 'ascending') {
        icon = isSortNumeric ? (<SortNumericUpIcon />) : (<SortAlphaUpIcon />);
      } else {
        icon = isSortNumeric ? (<SortNumericDownIcon />) : (<SortAlphaDownIcon />);
      }
      return icon;
    };

    const searchDropdownItems = columns
      .filter(({ key }) => key !== searchKey)
      .map(({ key, name }) => (
        <DropdownItem key={key} component="button">
          { name }
        </DropdownItem>
      ));

    const sortDropdownItems = columns
      .filter(({ key, isSortable }) => isSortable && key !== sortedColumnKey)
      .map(({ key, name }) => (
        <DropdownItem key={key} component="button">
          { name }
        </DropdownItem>
      ));

    return (
      <I18n>
        {({ i18n }) => (
          <div className="awx-toolbar">
            <Level>
              <LevelItem>
                <Toolbar style={{ marginLeft: '20px' }}>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <Checkbox
                        checked={isAllSelected}
                        onChange={onSelectAll}
                        aria-label={i18n._(t`Select all`)}
                        id="select-all"
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <div className="pf-c-input-group">
                        <Dropdown
                          className="searchKeyDropdown"
                          onToggle={this.onSearchDropdownToggle}
                          onSelect={this.onSearchDropdownSelect}
                          direction={up}
                          isOpen={isSearchDropdownOpen}
                          toggle={(
                            <DropdownToggle
                              onToggle={this.onSearchDropdownToggle}
                            >
                              { searchColumnName }
                            </DropdownToggle>
                          )}
                          dropdownItems={searchDropdownItems}
                        />
                        <TextInput
                          type="search"
                          aria-label={i18n._(t`Search text input`)}
                          value={searchValue}
                          onChange={this.handleSearchInputChange}
                        />
                        <Button
                          variant="tertiary"
                          aria-label={i18n._(t`Search`)}
                          onClick={this.onSearch}
                        >
                          <i className="fas fa-search" aria-hidden="true" />
                        </Button>
                      </div>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup className="sortDropdownGroup">
                    <ToolbarItem>
                      <Dropdown
                        onToggle={this.onSortDropdownToggle}
                        onSelect={this.onSortDropdownSelect}
                        direction={up}
                        isOpen={isSortDropdownOpen}
                        toggle={(
                          <DropdownToggle
                            onToggle={this.onSortDropdownToggle}
                          >
                            { sortedColumnName }
                          </DropdownToggle>
                        )}
                        dropdownItems={sortDropdownItems}
                      />
                    </ToolbarItem>
                    <ToolbarItem>
                      <Button
                        onClick={() => onSort(sortedColumnKey, sortOrder === 'ascending' ? 'descending' : 'ascending')}
                        variant="plain"
                        aria-label={i18n._(t`Sort`)}
                      >
                        {displayedSortIcon()}
                      </Button>
                    </ToolbarItem>
                  </ToolbarGroup>
                  { showExpandCollapse && (
                    <ToolbarGroup>
                      <ToolbarItem>
                        <Button variant="plain" aria-label={i18n._(t`Expand`)}>
                          <BarsIcon />
                        </Button>
                      </ToolbarItem>
                      <ToolbarItem>
                        <Button variant="plain" aria-label={i18n._(t`Collapse`)}>
                          <EqualsIcon />
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                  )}
                </Toolbar>
              </LevelItem>
              <LevelItem>
                <Tooltip message={i18n._(t`Delete`)} position="top">
                  <Button variant="plain" aria-label={i18n._(t`Delete`)}>
                    <TrashAltIcon />
                  </Button>
                </Tooltip>
                {addUrl && (
                  <Link to={addUrl}>
                    <Button variant="primary" aria-label={i18n._(t`Add`)}>
                      <PlusIcon />
                    </Button>
                  </Link>
                )}
              </LevelItem>
            </Level>
          </div>
        )}
      </I18n>
    );
  }
}

export default DataListToolbar;
