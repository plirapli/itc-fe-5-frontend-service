// Ngambil elemen form
const formulir = document.querySelector('form')

// Bikin trigger event submit pada elemen form
formulir.addEventListener('submit', kirimCatatan)

function kirimCatatan(e) {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_judul = document.querySelector('#judul');
  const elemen_isi = document.querySelector('#isi');

  // Ngambil value (isi) dari elemen input
  const id_catatan = elemen_judul.dataset.id;
  const judul = elemen_judul.value;
  const isi = elemen_isi.value;

  // Ngecek apakah harus POST atau PUT
  if (id_catatan == '') {
    // Tambah catatan
    axios.post('http://localhost:3002/v1/todo', {
      judul,
      isi
    })
      .then(() => {
        // bersihin formnya
        elemen_judul.dataset.id = ''
        elemen_judul.value = '';
        elemen_isi.value = '';

        // manggil fungsi get catatan biar datanya direfresh
        getCatatan()
      })
      .catch((error) => {
        console.log(error.message);
      });
  } else {
    axios.put(`http://localhost:3002/v1/todo/${id_catatan}`, {
      judul,
      isi
    })
      .then(() => {
        // bersihin formnya
        elemen_judul.dataset.id = ''
        elemen_judul.value = '';
        elemen_isi.value = '';

        // manggil fungsi get catatan biar datanya direfresh
        getCatatan()
      })
      .catch((error) => {
        console.log(error)
      })
  }

}

// Ngambil catatan
function getCatatan() {
  axios.get('http://localhost:3002/v1/todo')
    .then(({ data }) => {
      const pembungkus_catatan = document.querySelector('#pembungkus_catatan');
      const { data: kumpulan_catatan } = data;
      let tampilan = '';

      for (const catatan of kumpulan_catatan) {
        tampilan += tampilkanCatatan(catatan);
      }
      pembungkus_catatan.innerHTML = tampilan;

      hapusCatatan();
      editCatatan();
    })
    .catch((error) => {
      console.log(error.message);
    });
}

function tampilkanCatatan(catatan) {
  return `
    <div class="card-catatan">
      <h2>${catatan.judul}</h2>
      <p>${catatan.isi}</p>
      <div>
        <button data-id=${catatan.id} id='tombol-edit'>Edit</button>
        <button data-id=${catatan.id} id='tombol-hapus'>Hapus</button>
      </div>
    </div>
  `
}

function hapusCatatan() {
  const kumpulan_tombol_hapus = document.querySelectorAll("#tombol-hapus");

  kumpulan_tombol_hapus.forEach((tombol_hapus) => {
    tombol_hapus.addEventListener("click", () => {
      const id_catatan = tombol_hapus.dataset.id;
      axios.delete(`http://localhost:3002/v1/todo/${id_catatan}`)
        .then(() => {
          getCatatan();
        })
        .catch((error) => {
          console.log(error);
        })
    });
  })
}

function editCatatan() {
  const kumpulan_tombol_edit = document.querySelectorAll("#tombol-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      const id_catatan = tombol_edit.dataset.id
      const judul = tombol_edit.parentElement.parentElement.querySelector('h2').innerText;
      const isi = tombol_edit.parentElement.parentElement.querySelector('p').innerText;

      // Ngambil elemen input
      const elemen_judul = document.querySelector('#judul')
      const elemen_isi = document.querySelector('#isi')

      elemen_judul.dataset.id = id_catatan
      elemen_judul.value = judul
      elemen_isi.value = isi

      kirimCatatan();
    });
  })
}

getCatatan()