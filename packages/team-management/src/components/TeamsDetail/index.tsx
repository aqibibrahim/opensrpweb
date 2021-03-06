import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Organization } from '../../ducks/organizations';
import { Practitioner } from '../../ducks/practitioners';

export interface TeamsDetailProps extends Organization {
  onClose?: Function;
  teamMembers: Practitioner[];
  active: boolean;
  id: number;
  identifier: string;
  name: string;
  partOf?: number;
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, identifier, teamMembers } = props;
  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">Team name</p>
        <p className="mb-0">{name}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Status</p>
        <p className="mb-0">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Identifier</p>
        <p className="mb-0">{`${identifier}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Team members</p>
        {teamMembers.length ? (
          teamMembers.map((item) =>
            item.active ? <p key={item.identifier} className="mb-0">{`${item.name}`}</p> : null
          )
        ) : (
          <p className="no-team-members">No team members</p>
        )}
      </div>
    </div>
  );
};

export default TeamsDetail;
