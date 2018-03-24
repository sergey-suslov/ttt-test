(function () {

    var PLAYER_ONE_CLASS = 'cross';
    var PLAYER_TWO_CLASS = 'zero';
    var isMyTurn = true;
    var socket = io();
    var table = $('table');

    var field = getBaseField();

    function getBaseField() {
        var field = [table.find('td').slice(0, 3), table.find('td').slice(3, 6), table.find('td').slice(6, 9)];

        field = field.map(function (row) {
            row = row.map(function (cell) {
                var cell = $('#' + row[cell].id);
                cell.click(cellClicked);
                return cell;
            });
            return row;
        });

        return field;
    }

    function cellClicked(e) {
        console.log(e);
        if (isMyTurn) {
            var idSplitted = e.currentTarget.id.split('-');
            socket.emit('player-turn', {row: idSplitted[1], column: idSplitted[2]});
            if (e.currentTarget.className.length === 0)
                e.currentTarget.className = PLAYER_ONE_CLASS;
            isMyTurn = false;
        }
    }

    function updateUI({field: newField, winner}) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                console.log(newField[i][j]);
                switch (newField[i][j]) {
                    case 1:
                        console.log(newField[i][j]);
                        field[i][j].addClass(PLAYER_ONE_CLASS);
                        break;
                    case 2:
                        console.log(newField[i][j]);
                        field[i][j].addClass(PLAYER_TWO_CLASS);
                        break;
                    default:
                        field[i][j].removeClass(PLAYER_ONE_CLASS);
                        field[i][j].removeClass(PLAYER_TWO_CLASS);
                        break;
                }
            }
        }
        if (winner) {
            $('#result-modal').modal();
            $('.modal-body').html(winner === 1 ? 'Winner: You' : winner === 2 ? 'Winner: AI' : 'Draw');
            $('#retry-button').click(function () {
                socket.emit('retry');
            });
            $('#save-download-button').click(function () {
                socket.emit('download');
            });
        }
    }


    socket.on('connection-status', function (status) {
        $('#status').html(status);
        console.log(status);
    });
    socket.on('update-field', function (result) {
        if (result)
            updateUI(result);
        isMyTurn = true;
    });
    socket.on('update-field-retry', function (result) {
        console.log(result);
        if (result)
            updateUI(result);
        isMyTurn = true;
    });
})();