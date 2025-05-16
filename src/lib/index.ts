// place files you want to import through the `$lib` alias in this folder.

function getStatusName(status: string): string {
    if (status === 'administrator') {
        return 'Администратор';
    }
    if (status === 'dispatcher') {
        return 'Диспетчер';
    }
    if (status === 'installer') {
        return 'Монтажник';
    }
    return 'Неизвестно';
}

export { getStatusName };