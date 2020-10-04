// Data Layer
var Data = (function() {
    // editmodeid carries the id of element currenly being edited to prevent confusion.
    var currentTime, appState, editModeId, status, history;

    history = [];

    var HistoryItem = function(h, m, s, note) {
        this.id = history.length;
        this.time = new Time(h, m, s);
        this.note = note;
    };


    var Time = function(h, m, s) {
        this.hours = h;
        this.minutes = m;
        this.seconds = s;
    };


    status = {
        Running: 0,
        Stopped: 1,
        Paused: 2
    };

    var countUp = function() {
        if (currentTime.seconds + 1 < 60) {
            currentTime.seconds++;
        } else {
            currentTime.seconds = 0;
            if (currentTime.minutes + 1 < 60) {
                currentTime.minutes++;
            } else {
                currentTime.minutes = 0;
                currentTime.hours++;
            }
        }
        return currentTime;

    };

    var setCurrentTime = function(h, m, s) {
        currentTime = new Time(h, m, s);
    };

    var getCurrentTime = function() {
        return currentTime;
    };


    var addItemToHistory = function(note) {
        var historyItem = new HistoryItem(currentTime.hours, currentTime.minutes, currentTime.seconds, note);
        history.push(historyItem);
        return historyItem;
    };

    var removeItemFromHistory = function(id) {
        history.forEach(function(current, index) {
            if (current.id === id) {
                history.splice(index, 1);
            }
        });
    };

    var updateHistoryItemContent = function(id, note) {
        history.forEach(function(current, index) {
            if (current.id === id) {
                history[index].note = note;
            }
        });
    };

    var clearHistory = function() {
        history = [];
    };


    return {
        CountUp: countUp,
        EditModeId: editModeId,
        AppState: appState,
        Status: status,
        SetCurrentTime: setCurrentTime,
        GetCurrentTime: getCurrentTime,
        AddHistoryItem: addItemToHistory,
        RemoveHistoryItem: removeItemFromHistory,
        UpdateHistoryItemContent: updateHistoryItemContent,
        ClearHistory: clearHistory
    };

})();

// Presentation Layer
var Presentation = (function() {

    var DOM = {

        ClassNames: {
            StartBtn: '.counter--start',
            PauseBtn: '.counter--pause',
            StopBtn: '.counter--stop',
            // Clock Placeholder
            HoursePlc: '.counetr__block--hour',
            MinutesPlc: '.counetr__block--minute',
            SecondsPlc: '.counetr__block--second',
            // History
            HistoryContainer: '.history__items',
            HistoryClear: '.history__header--clear',
            HistItem: '.history__item',
            HistNoteContent: '.history__note--content',
            HistItemRemove: '.history__note--remove',
            HistItemEdit: '.history__note--edit'
        },
        IdNames: {

        }
    };

    var formatTime = function(time) {
        var timeFormat = {
            h: time.hours >= 0 && time.hours < 10 ? '0' + time.hours : time.hours,
            m: time.minutes >= 0 && time.minutes < 10 ? '0' + time.minutes : time.minutes,
            s: time.seconds >= 0 && time.seconds < 10 ? '0' + time.seconds : time.seconds
        };
        return timeFormat;
    };

    var countUp = function(currentTime) {
        var timeFormat = formatTime(currentTime);
        document.querySelector(DOM.ClassNames.HoursePlc).textContent = timeFormat.h;
        document.querySelector(DOM.ClassNames.MinutesPlc).textContent = timeFormat.m;
        document.querySelector(DOM.ClassNames.SecondsPlc).textContent = timeFormat.s;
    };

    var disableCtrl = function(selector) {
        var el = document.querySelector(selector);
        el.classList.add('disabled');
    };

    var enableCtrl = function(selector) {
        var el = document.querySelector(selector);
        el.classList.remove('disabled');
    };

    var resetUI = function() {
        document.querySelector(Presentation.DOM.cls.HoursePlc).textContent = '00';
        document.querySelector(Presentation.DOM.cls.MinutesPlc).textContent = '00';
        document.querySelector(Presentation.DOM.cls.SecondsPlc).textContent = '00';

        // TODO: Reset the History Tab

    };

    var promptNote = function() {
        var note = prompt("Wanna add a hint for this time?");
        return note;
    };

    var addHistoryItem = function(historyItem) {
        var template, timeFormat, html;
        template = '<div id="hist-%id%" class="history__item"><div class="history__time">%hh%:%mm%:%ss%</div><div class="history__note"><p class="history__note--content">%note%</p><div class=""><button data-type="edit" type="button" class=" history__control history__note--edit"><ion-icon name="create-outline"></ion-icon></button><button data-type="remove" type="button" class="history__control history__note--remove"><ion-icon name="trash-outline"></ion-icon></button></div></div></div>';

        timeFormat = formatTime(historyItem.time);

        html = template.replace('%hh%', timeFormat.h).replace('%mm%', timeFormat.m).replace('%ss%', timeFormat.s).replace('%note%', historyItem.note).replace('%id%', historyItem.id);

        document.querySelector(DOM.ClassNames.HistoryContainer).insertAdjacentHTML('beforeend', html);
    };


    var removeHistoryItem = function(id) {
        document.querySelector('#hist-' + id).remove();
    };

    var clearHistory = function() {
        var fields = document.querySelectorAll(DOM.ClassNames.HistItem);
        NodeListForeach(fields, function(current, index, arr) {
            current.remove();
        });
    };


    var NodeListForeach = function(fields, callback) {
        for (var i = 0; i < fields.length; i++) {
            callback(fields[i], i, fields);
        }
    };

    var enableEditMode = function(id, editModeId) {
        if (editModeId === null) {
            var el = document.querySelector('#hist-' + id).querySelector(DOM.ClassNames.HistNoteContent);
            el.classList.add('history__note--editable');
            el.contentEditable = true;
            return id;
        }
    };

    var disableEditMode = function(editModeId) {
        var el = document.querySelector('#hist-' + editModeId).querySelector(DOM.ClassNames.HistNoteContent);
        el.classList.remove('history__note--editable');
        el.contentEditable = false;
        return el.textContent;
    };


    return {
        DOM: {
            cls: DOM.ClassNames,
            Id: DOM.IdNames
        },
        CountUp: countUp,
        DisableCtrl: disableCtrl,
        EnableCtrl: enableCtrl,
        PromptNote: promptNote,
        AddHistoryItem: addHistoryItem,
        RemoveHistoryItem: removeHistoryItem,
        ResetUI: resetUI,
        EnableEditMode: enableEditMode,
        DisableEditMode: disableEditMode,
        ClearHistory: clearHistory
    };

})();

// Controller
var Controller = (function(data, presentation) {
    var Interval;


    function Start() {
        if (Data.AppState === Data.Status.Stopped || Data.AppState === Data.Status.Paused) {

            // Tick each 1s
            Interval = setInterval(function() {
                Presentation.CountUp(Data.CountUp());
            }, 1000);

            // Change AppStatus
            data.AppState = Data.Status.Running;
            presentation.DisableCtrl(presentation.DOM.cls.StartBtn);
            presentation.EnableCtrl(presentation.DOM.cls.PauseBtn);
            presentation.EnableCtrl(presentation.DOM.cls.StopBtn);
        }
    }


    function Pause() {
        if (data.AppState === data.Status.Running) {
            // Stop Counter
            if (Interval !== undefined) {
                clearInterval(Interval);
            }

            // Change AppStatus
            data.AppState = data.Status.Paused;
            presentation.DisableCtrl(presentation.DOM.cls.PauseBtn);
            presentation.EnableCtrl(presentation.DOM.cls.StartBtn);
            presentation.EnableCtrl(presentation.DOM.cls.StopBtn);
        }
    }

    function Stop() {
        if (data.AppState === data.Status.Running || data.AppState === data.Status.Paused) {
            // Stop Counter
            if (Interval !== undefined) {
                clearInterval(Interval);
            }

            // Add Result to History
            addHistoryItem();

            // Change AppStatus
            data.AppState = data.Status.Stopped;
            presentation.DisableCtrl(presentation.DOM.cls.PauseBtn);
            presentation.DisableCtrl(presentation.DOM.cls.StopBtn);
            presentation.EnableCtrl(presentation.DOM.cls.StartBtn);


            // Reset UI & Backing Data
            Reset();
        }
    }

    var addHistoryItem = function() {
        var note = presentation.PromptNote();
        var historyItem = data.AddHistoryItem(note);
        presentation.AddHistoryItem(historyItem);
    };


    var Reset = function() {
        presentation.ResetUI();
        data.SetCurrentTime(0, 0, 0);
        data.AppState = data.Status.Stopped;
        data.EditModeId = null;
        presentation.DisableCtrl(presentation.DOM.cls.PauseBtn);
        presentation.DisableCtrl(presentation.DOM.cls.StopBtn);
    };

    var SetupEventHandlers = function() {
        // Start Button
        document.querySelector(Presentation.DOM.cls.StartBtn).addEventListener('click', function() {
            if (data.AppState === data.Status.Stopped || data.AppState === data.Status.Paused) {
                Start();
            }
        });

        // Pause Button
        document.querySelector(Presentation.DOM.cls.PauseBtn).addEventListener('click', function() {
            if (data.AppState === data.Status.Running) {
                Pause();
            }
        });

        // Stop
        document.querySelector(Presentation.DOM.cls.StopBtn).addEventListener('click', function() {

            if (data.AppState === data.Status.Paused || data.AppState === data.Status.Running) {
                Stop();
            }
        });


        // Hist Items Buttons
        document.querySelector(presentation.DOM.cls.HistoryContainer).addEventListener('click', function(e) {
            var target = e.target.classList.contains('history__control') ? e.target : e.target.parentNode;
            var type = target.getAttribute('data-type');
            id = String(target.parentNode.parentNode.parentNode.id).split('-')[1];
            if (type && type === 'remove') {
                presentation.RemoveHistoryItem(id);
                data.RemoveHistoryItem(Number(id));
            } else if (type && type === 'edit') {
                // Enable EditMode for Element
                data.EditModeId = presentation.EnableEditMode(id, data.EditModeId);
            }
        });

        // General Dom Enter Listener 
        document.addEventListener('keypress', function(e) {
            if (data.EditModeId !== null) {
                if (e.ctrlKey && e.code === 'Enter') {
                    var content = presentation.DisableEditMode(data.EditModeId);
                    data.UpdateHistoryItemContent(Number(data.EditModeId), content);
                    data.EditModeId = null;
                }
            }
        });

        document.querySelector(presentation.DOM.cls.HistoryClear).addEventListener('click', function() {
            presentation.ClearHistory();
            data.ClearHistory();
        });
    };


    return {
        init: function() {
            SetupEventHandlers();
            Reset();
            data.AppState = data.Status.Stopped;
        },
        test: function() {
            return Interval;
        }
    };

})(Data, Presentation);


Controller.init();