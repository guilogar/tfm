import sys


def get_arguments():
    arguments = {
        "--lengthMinutes": "",
        "--farmId": "",
        "--year": "",
        "--user": "",
        "--password": "",
        "--host": "",
        "--database": "",
    }
    for i in range(1, len(sys.argv)):
        param = sys.argv[i].split('=')
        if len(param) == 1:
            param.append("")
        argument = param[0]
        value = param[1]
        arguments[argument] = value

    errors = []
    for argument in arguments.keys():
        if (arguments[argument] == ""):
            errors.append("argument " + "\033[1;31;40m" +
                          argument + "\033[0;37;40m" +
                          " has not informated!")

    if (len(errors) > 0):
        raise Exception("\n".join(errors))

    return arguments
