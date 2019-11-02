// cargar datatable en pagina gateways
$(document).ready(function() {
    $.ajax({
        url: 'http://localhost/tesis-backend/public/gateway/datatables',
        type: 'GET',
        success: function(data) {
            console.log(data);
            $.each(data, function(i, gateway) {
                $('#table-body').append(
                    '<tr role="row" class="odd">\n' +
                    '                                <td class="sorting_1">' + gateway.id + '</td>\n' +
                    '\n' +
                    '                                <td>\n' +
                    '                                    <div class="text-semibold" id="gateway_name"><a href="http://localhost/tesis-backend/public/gateway/"'+ gateway.id +'>' + gateway.nombre + '</a></div>\n' +
                    '                                </td>\n' +
                    '                                <td>'+ gateway.lat +
                    '                                </td>\n' +
                    '                                <td>' + gateway.long +
                    '                                </td>\n' +
                    '                                <td>' + gateway.gw_id +
                    '                                </td>\n' +
                    '                                <td>' + gateway.updated_at +
                    '                                </td>\n' +
                    '                                <td class="text-center">\n' +
                    '                                    <ul class="icons-list">\n' +
                    '                                        <li class="dropdown">\n' +
                    '                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu9"></i></a>\n' +
                    '                                            <ul class="dropdown-menu dropdown-menu-right">\n' +
                    '                                                <li><a href="#"><i class="icon-eye"></i> Ver</a></li>\n' +
                    '                                                <li class="divider"></li>\n' +
                    '                                                <li><a href="#"><i class="icon-pencil7"></i> Editar</a></li>\n' +
                    '                                                <li><a href="#"><i class="icon-cross2"></i> Eliminar</a></li>\n' +
                    '                                            </ul>\n' +
                    '                                        </li>\n' +
                    '                                    </ul>\n' +
                    '                                </td>\n' +
                    '                            </tr>'
                );
                // $('#gateway_name').text(gateway.nombre);
            });
        },
        error: function(data){
            var errors = data.responseJSON;
            // swal("Oops...", "Algo salio mal!", "error");
            $.each(errors, function(key,val){
                console.log(val);
            })
        }
    });

} );