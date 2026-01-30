export default function EmailTable({ emails }) {
    return (
        <table border="1">
        <thead>
            <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {emails.map(e => (
            <tr key={e.id}>
                <td>{e.email}</td>
                <td>{e.name}</td>
                <td>{e.status}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
    }
    