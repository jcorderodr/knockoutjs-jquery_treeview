ko.bindingHandlers.treeView = {
    createNodes: function (rootElement, options) {

        var rootTmpl = '<script id="ko-treeview-root-tmpl"><div  data-bind="template:{name: \'ko-treeview-search-tmpl\'}"></div><div class="well"><ul id="componentDateTree" class="treeview permissionsList" data-bind="template:{foreach:$data.data,name: \'ko-treeview-node-tmpl\'}"></ul></div></script>';

        var searchTmpl = '<script id="ko-treeview-search-tmpl"><div class="form-group"><input type="text" class="form-control" data-bind="value:$data.search, valueUpdate: \'afterkeydown\'" placeholder="Search"></div></script>';

        var nodeTmpl = '<script id="ko-treeview-node-tmpl"><li><div class="hitarea collapsable-hitarea lastCollapsable-hitarea"></div><span> <span data-bind="text: $data[$root.label]"></span></span><ul data-bind="template:{name:getNodeTemplate,foreach:$data[$root.childNode]}"></ul></li></script>';

        var itemTmpl = '<script id="ko-treeview-item-tmpl"><li><span data-bind="visible:$data[$root.label].indexOf($root.search()) > -1"><input type="checkbox" data-bind="checked: $root.selected, attr:{value:$data[$root.label], id:$data[$root.label]}" /><span data-bind="text:$data[$root.label], attr:{for:$data[$root.label]}"></span></span></li></script>';

        document.body.insertAdjacentHTML('beforeend', rootTmpl);
        document.body.insertAdjacentHTML('beforeend', searchTmpl);
        document.body.insertAdjacentHTML('beforeend', nodeTmpl);
        document.body.insertAdjacentHTML('beforeend', itemTmpl);

        //apply first binding
        ko.applyBindingsToNode(rootElement, { template: { name: "ko-treeview-root-tmpl" } }, options);

    },
    init: function (element, valueAccessor) {
        this.getNodeTemplate = function (e) {
            return e.Children && e.Children.length > 0 ? 'ko-treeview-node-tmpl' : 'ko-treeview-item-tmpl';
        };

        //style element
        element.className = "ko-treeview-container";

        //extend options with search
        var options = valueAccessor();
        options.search = ko.observable("");

        //set default data values
        if (!options.label) options.label = 'Name';
        if (!options.childNode) options.childNode = 'Children';

        //create the tree
        ko.bindingHandlers.treeView.createNodes(element, options);
        valueAccessor().data.subscribe(function () {
            ko.bindingHandlers.treeView.createNodes(element, options);
        });

        return { controlsDescendantBindings: true };
    }

};

(function () {

    function ComponentTreeViewModel() {
        var self = this;

        self.selectedNodes = ko.observableArray([]);
        self.dataTree = ko.observableArray();

        self.fill = function () {
            $.getJSON('data.json', function (data) {

                var list = new Array();
                ko.utils.arrayForEach(data, function (i) {
                    list.push(i);
                });
                self.dataTree(list);

                var jEl = $('#componentDateTree');
                jEl.treeview({});
            });  
        };
    }

    $(document).ready(function () {
        var el = document.getElementById('component');
        var vm = new ComponentTreeViewModel();
        ko.applyBindings(vm, el);

        vm.fill();  
    });

})();
