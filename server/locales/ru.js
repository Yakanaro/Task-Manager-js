// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь удален',
        },
        edit: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь изменен',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус удален',
        },
        edit: {
          error: 'Не удалось изменить статус',
          success: 'Статус изменен',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка удалена',
        },
        edit: {
          error: 'Не удалось изменить метку',
          success: 'Метка изменена',
      },
    },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача удалена',
        },
        edit: {
          error: 'Не удалось изменить задачу',
          success: 'Задача изменена',
      } 
    },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статус',
        labels: 'Метки',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          email: 'Email',
          password: 'Пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      errors: {
        email: 'Некорректный email'
      }
      },
      users: {
        id: 'ID',
        fullName:'Полное имя',
        email: 'Email',
        action:'Действия',
        createdAt: 'Дата создания',
          actions: {
            delete: 'Удалить',
            edit:'Изменить',
          },
        new: {
          email: 'Введите вашу почту',
          password: 'Придумайте пароль',
          firstName: 'Введите ваше имя',
          lastName: 'Введите вашу фамилию',
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          editUser: 'Изменить пользователя',
          editButton: 'Изменить',
          firstName: 'Имя',
          lastName: 'Фамилия',
          email: 'Почта',
          password: 'Пароль',
          submit: 'Принять',
        }
      },
      statuses: {
        title: 'Изменение статуса',
        index: {
          id: 'ID',
          name: 'Наименование',
          createdAt: 'Дата создания',
          actions: 'Действия',
          create: 'Создать',
      },
        new: {
          createStatus: 'Введите статус',
          name: 'Наименование',
          create: 'Создать статус',
        },
        actions: {
          edit: 'Изменить',
          delete: 'Удалить',
          submit: 'Принять',
        },
    },
      labels: {
        index: {
          id: 'ID',
          name: 'Наименование',
          createdAt: 'Дата создания',
          actions: 'Действия',
        },
        actions: {
          create: 'Создать',
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          title: 'Создать метку',
          name: 'Наименование',
          submit: 'Принять',
          newName: 'Введите наименование',
        },
        edit: {
          title: 'Изменить метку',
        }
      },
      tasks: {
        index: {
          id: 'ID',
          name: 'Наименование',
          createdAt: 'Дата создания',
          status: 'Статус',
          executor: 'Исполнитель',
          author: 'Автор',
          onlyUserTasks: 'Только мои задачи',
          label: 'Метка',
          description: 'Описание',
        },
        actions: {
          create: 'Создать задачу',
          view: 'Показать',
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          title: 'Создать задачу',
          submit: 'Создать',
        },
        edit: {
          title: 'Изменить задачу',
        }
      },
        welcome: {
          index: {
            hello: 'Привет от Хекслета!',
            description: 'Практические курсы по программированию',
            more: 'Узнать Больше',
          },
      },
    },
  },
};
