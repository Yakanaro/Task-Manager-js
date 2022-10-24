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
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          email: 'Введите вашу почту',
          password: 'Придумайте пароль',
          firstName: 'Введите ваше имя',
          lastName: 'Введите вашу фамилию',
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          firstName: 'Имя',
          lastName: 'Фамилия',
          email: 'Почта',
          password: 'Пароль',
          submit: 'Принять',
          edit: 'Редактировать пользователя',
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
