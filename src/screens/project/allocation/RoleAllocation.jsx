import React, { Component } from 'react'
import { Transfer, Table, Tag } from 'antd';
import difference from 'lodash/difference';
import { Button } from 'semantic-ui-react';
import Model from '../../../components/model/model'
import EditRole from './EditRole';


var originTargetKeys;
export default class RoleAllocation extends Component {
  state = {
    targetKeys: originTargetKeys,
    disabled: false,
    showSearch: true,
    open: false
  };

  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };
  handleOpen = () => {
    this.setState({
      open: true
    })
  }
  handleClose = () => {
    this.setState({
      open: false
    })
  }

  render() {
    // Customize Table Transfer
    const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
      <Transfer {...restProps} showSelectAll={false}>
        {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;

          const rowSelection = {
            getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
            onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows
                .filter(item => !item.disabled)
                .map(({ key }) => key);
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
            onSelect({ key }, selected) {
              onItemSelect(key, selected);
            },
            selectedRowKeys: listSelectedKeys,
          };

          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : null }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    );

    const mockTags = ['SE', 'QAE', 'TL', 'ASE'];
    const mockData = [];
    const role = ['JSE', 'QAL', 'TL', 'SE']
    const color = ['blue', 'green', 'orange', 'red']

    originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);


    const { targetKeys, disabled, showSearch, open } = this.state;
    for (let i = 0; i < 20; i++) {
      mockData.push({
        key: i.toString(),
        employeeID: `EMP${i + 1}`,
        fullname: `Employee${i + 1}`,
        designation: <Tag color={color[i % 4]}>{mockTags[i % 4]}</Tag>,
        role: role[i % 4],
        action: <Button
          icon='edit'
          label={{ as: 'a', basic: true, content: 'Edit' }}
          labelPosition='right'
          color='blue'
          onClick={this.handleOpen}
        />
      });
    }
    const leftTableColumns = [
      {
        dataIndex: 'employeeID',
        title: 'Employee ID',
      },
      {
        dataIndex: 'fullname',
        title: 'Full Name',
      },
      {
        dataIndex: 'designation',
        title: 'Designation',
      },

    ];
    const rightTableColumns = [
      {
        dataIndex: 'employeeID',
        title: 'Employee ID',
      },
      {
        dataIndex: 'fullname',
        title: 'Full Name',
      },
      {
        dataIndex: 'designation',
        title: 'Designation',
      },
      {
        dataIndex: 'role',
        title: 'Role',
      },
      {
        dataIndex: 'action',
        title: 'Action',
      },
    ];
    return (
      <div>
        <TableTransfer
          dataSource={mockData}
          targetKeys={targetKeys}
          disabled={disabled}
          showSearch={showSearch}
          onChange={this.onChange}
          filterOption={(inputValue, item) =>
            item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
        <Model open={open} handleOpen={this.handleOpen} handleClose={this.handleClose} width={30} form={<EditRole />} title='Edit Role' />
      </div>
    );
  }
}