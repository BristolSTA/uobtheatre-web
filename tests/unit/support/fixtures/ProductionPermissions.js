export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      slug: 'legally-ginger',
      name: 'Legally Ginger',
      assignablePermissions: [
        {
          name: 'add_production',
          description: 'Can add production',
          userCanAssign: false
        },
        {
          name: 'approve_production',
          description: 'Can approve production pending publication',
          userCanAssign: true
        },
        {
          name: 'boxoffice',
          description: 'Can use boxoffice for production',
          userCanAssign: true
        },
        {
          name: 'change_production',
          description: 'Can change production',
          userCanAssign: true
        },
        {
          name: 'delete_production',
          description: 'Can delete production',
          userCanAssign: false
        },
        {
          name: 'force_change_production',
          description: 'Can edit production once live',
          userCanAssign: false
        },
        {
          name: 'sales',
          description: 'Can view sales for production',
          userCanAssign: true
        },
        {
          name: 'view_bookings',
          description: 'Can inspect bookings and users for this production',
          userCanAssign: true
        },
        {
          name: 'view_production',
          description: 'Can view production',
          userCanAssign: true
        }
      ],
      assignedUsers: [
        {
          user: {
            id: 'VXNlck5vZGU6NTI3OGM1MjMtMDBhZi00M2Y3LTlmZjgtOWQwNzllYmRmMmE2',
            firstName: 'Clara',
            lastName: 'Rayner',
            email: 'test@email.com'
          },
          assignedPermissions: ['boxoffice', 'change_production']
        }
      ]
    },
    overrides
  );
};
