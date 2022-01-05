const pg = require('../utils/pg');

async function getCourseCategories() {
  try {
    return await pg(
      false,
      `
        select
          id,
          to_char(created_at, 'YYYY-MM-DD') as created_at,
          name,
          poster,
          description,
          status,
          (select count(*) from courses as c where c.category_id = course_categories.id )
        from
          course_categories
        where
        status = 'enabled' or status = 'disabled'
        order by
          id desc
      `
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseCategories]:${error}`);
  }
}

async function getCourseCategoriesByPattern(pattern) {
  try {
    return await pg(
      false,
      `select
      id,
      to_char(created_at, 'YYYY-MM-DD') as created_at,
      name,
      poster,
      description,
      status
    from
      course_categories
    where
    (status = 'enabled' or status = 'disabled')
      and lower(name) like '%' || lower($1) || '%'
    order by
      id desc;`,
      pattern
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseCategoriesByPattern]:${error}`);
  }
}

async function getCourseCategoryByName(name) {
  try {
    return await pg(
      true,
      "select * from course_categories where name = $1 and status = 'enabled';",
      name
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseCategoryByName]:${error}`);
  }
}

async function insertCourseCategory(name, description) {
  try {
    return await pg(
      true,
      'insert into course_categories(name,description) values($1,$2) returning *;',
      name,
      description
    );
  } catch (error) {
    throw Error(`Courses repository [insertCourseCategory]:${error}`);
  }
}

async function getCourseCategoryById(categoryId) {
  try {
    return await pg(
      true,
      "select * from course_categories where id = $1 and status in ('enabled', 'disabled');",
      categoryId
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseCategoryById]:${error}`);
  }
}

async function getCourseCategoryByIdWithStatus(categoryId) {
  try {
    return await pg(
      true,
      "select * from course_categories where id = $1 and status='enabled' or status='disabled';",
      categoryId
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseCategoryByIdWithStatus]:${error}`);
  }
}

async function updateCourseCategory(name, description, status, id) {
  try {
    return await pg(
      true,
      'update course_categories set name = $1, description = $2, status = $3 where id = $4 returning *;',
      name,
      description,
      status,
      id
    );
  } catch (error) {
    throw Error(`Courses repository [updateCourseCategory]:${error}`);
  }
}

async function updateCourseCategoryImage(poster, id) {
  try {
    return await pg(
      true,
      'update course_categories set poster = $1 where id = $2 returning *;',
      poster,
      id
    );
  } catch (error) {
    throw Error(`Courses repository [updateCourseCategoryImage]:${error}`);
  }
}

async function updateCourseImage(poster, id) {
  try {
    return await pg(true, 'update courses set poster = $1 where id = $2 returning *;', poster, id);
  } catch (error) {
    throw Error(`Courses repository [updateCourseImage]:${error}`);
  }
}

async function deleteCourseCategory(id) {
  try {
    return await pg(
      true,
      "update course_categories set status = 'deleted' where id = $1 returning *;",
      id
    );
  } catch (error) {
    throw Error(`Courses repository [deleteCourseCategory]:${error}`);
  }
}

async function getCourseByName(name) {
  try {
    return await pg(
      true,
      "select * from courses where name = $1 and status in ('enabled','disabled');",
      name
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseByName]:${error}`);
  }
}

async function getCourses() {
  try {
    return await pg(
      false,
      `
        select
          id,
          to_char(created_at, 'YYYY-MM-DD') as created_at,
          name,
          description,
          category_id,
          status,
          lessons_count,
          lessons_count_for_month,
          type,
          max_students_count,
          lesson_duration,
          poster,
          status
        from
          courses
        where
        status in ('enabled','disabled')
        order by
          id desc;
      `
    );
  } catch (error) {
    throw Error(`Courses repository [getCourses]:${error}`);
  }
}

async function getCoursesByPattern(pattern) {
  try {
    return await pg(
      false,
      `
        select
          id,
          to_char(created_at, 'YYYY-MM-DD') as created_at,
          name,
          description,
          category_id,
          status,
          lessons_count,
          lessons_count_for_month,
          type,
          max_students_count,
          lesson_duration,
          poster,
          status
        from
          courses
        where
          (status in ('enabled','disabled'))
        and
          lower(name) like '%' || lower($1) || '%'
        order by
          id desc;
      `,
      pattern
    );
  } catch (error) {
    throw Error(`Courses repository [getCoursesByPattern]:${error}`);
  }
}

async function insertCourse(args) {
  try {
    return await pg(
      true,
      `
        insert into courses(
          name,
          description,
          category_id,
          lessons_count,
          lessons_count_for_month,
          type,
          max_students_count,
          lesson_duration
        ) values(
          $1, $2, $3, $4, $5, $6, $7, $8
        ) returning *;
      `,
      args.name,
      args.description,
      args.categoryId,
      args.lessonsCount,
      args.lessonsCountForMonth,
      args.type,
      args.maxStudentsCount,
      args.lessonDuration
    );
  } catch (error) {
    throw Error(`Courses repository [insertCourse]:${error}`);
  }
}

async function getCourseById(courseId) {
  try {
    return await pg(
      true,
      "select * from courses where id = $1 and status in ('enabled', 'disabled');",
      courseId
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseById]:${error}`);
  }
}

async function getCourseByIdWithStatus(courseId) {
  try {
    return await pg(
      true,
      "select * from courses where id = $1 and status in ('enabled','disabled');",
      courseId
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseByIdWithStatus]:${error}`);
  }
}

async function updateCourse(
  name,
  description,
  categoryId,
  status,
  lessonsCount,
  lessonsCountForMonth,
  type,
  maxStudentsCount,
  lessonDuration,
  id
) {
  try {
    return await pg(
      true,
      `update courses 
          set name = $1, 
              description = $2, 
              category_id = $3, 
              status = $4, 
              lessons_count = $5, 
              lessons_count_for_month = $6, 
              type = $7,
              max_students_count = $8,
              lesson_duration = $9  
              where id = $10 returning *;`,
      name,
      description,
      categoryId,
      status,
      lessonsCount,
      lessonsCountForMonth,
      type,
      maxStudentsCount,
      lessonDuration,
      id
    );
  } catch (error) {
    throw Error(`Courses repository [updateCourse]:${error}`);
  }
}

async function deleteCourse(id) {
  try {
    return await pg(true, "update courses set status = 'deleted' where id = $1 returning *;", id);
  } catch (error) {
    throw Error(`Courses repository [deleteCourse]:${error}`);
  }
}

const findCourseById = async (id) => {
  try {
    const query = `
      select * from courses where status = 'enabled' and id = $1;
    `;

    const data = await pg(true, query, id);

    return data;
  } catch (error) {
    throw new Error(`[CoursesRepository]:[findCourseById]:${error}`);
  }
};

async function getCourseCategoryImage(id) {
  try {
    return await pg(
      true,
      `
      select poster
       from course_categories
       where id = $1
    `,
      id
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseCategoryImage]:${error}`);
  }
}

async function getCourseImage(id) {
  try {
    return await pg(
      true,
      `
      select poster
       from courses
       where id = $1
    `,
      id
    );
  } catch (error) {
    throw Error(`Courses repository [getCourseImage]:${error}`);
  }
}

async function courseById(id) {
  try {
    return await pg(
      true,
      `
        select
          id,
          to_char(created_at, 'YYYY-MM-DD') as created_at,
          name,
          description,
          category_id,
          status,
          lessons_count,
          lessons_count_for_month,
          type,
          max_students_count,
          lesson_duration,
          poster,
          status
        from
          courses
        where
          (status in ('enabled','disabled'))
        and
          id = $1
      `,
      id
    );
  } catch (error) {
    throw Error(`Courses repository [courseById]:${error}`);
  }
}

module.exports = {
  findCourseById,
  getCourseCategories,
  getCourseCategoriesByPattern,
  getCourseCategoryByName,
  insertCourseCategory,
  getCourseCategoryById,
  updateCourseCategory,
  deleteCourseCategory,
  getCourseByName,
  getCourses,
  getCoursesByPattern,
  insertCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourseCategoryImage,
  getCourseCategoryImage,
  updateCourseImage,
  getCourseImage,
  getCourseByIdWithStatus,
  getCourseCategoryByIdWithStatus,
  courseById
};
